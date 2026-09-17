import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Target email for User Requests (defaults to jenitson05@gmail.com per requirement)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "jenitson05@gmail.com";

// Developer / Administrator Notification Configuration
const DEVELOPER_NOTIFICATION_EMAIL = process.env.DEVELOPER_NOTIFICATION_EMAIL || "jenitson46@gmail.com";

// Admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "aegis_commander";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Aegis#Overwatch2026!";

// On Vercel, serverless writeable directory is /tmp
const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(__dirname, "../data");
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}

const AUDIT_FILE = path.join(DATA_DIR, "audit_log.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");
const REQUESTS_FILE = path.join(DATA_DIR, "user_requests.json");

function ensureFile(filePath, defaultContent = "[]") {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, defaultContent, "utf8");
    }
  } catch {}
}

ensureFile(AUDIT_FILE);
ensureFile(FEEDBACK_FILE);
ensureFile(REQUESTS_FILE);

function appendToJsonArray(filePath, newItem) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const arr = JSON.parse(raw || "[]");
    arr.push(newItem);
    fs.writeFileSync(filePath, JSON.stringify(arr, null, 2), "utf8");
  } catch (err) {
    console.error(`Error saving to ${filePath}:`, err);
  }
}

function readJsonArray(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

// In-memory sessions
const sessions = new Map();
const processedLogins = new Set();

// Nodemailer transport
let mailTransport = null;
const GMAIL_USER = process.env.GMAIL_USER || process.env.SMTP_USER;
const GMAIL_PASS = process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

if (GMAIL_USER && GMAIL_PASS) {
  mailTransport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });
} else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  mailTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// Send Developer Notification function
async function sendDeveloperNotification({ email, sessionId, language, loginTime }) {
  const subject = "AEGIS — New User Entered the Command Center";
  const body = `AEGIS SYSTEM NOTIFICATION\n==================================================\nA new user has successfully entered the protected AEGIS interaction system.\n\nUSER INFORMATION\nEmail: ${email}\nLogin status: AUTHENTICATED\nLogin time: ${loginTime}\nSession ID: ${sessionId}\nSession: ACTIVE\nLanguage: ${language || "English"}\n\nThe user has now entered the AEGIS chatbot and can interact with the superhero through text and voice.\n\n==================================================\nAEGIS SYSTEM\nONLINE`;

  if (mailTransport) {
    try {
      await mailTransport.sendMail({
        from: `"AEGIS Command Center" <${GMAIL_USER || "no-reply@aegis-defense.io"}>`,
        to: DEVELOPER_NOTIFICATION_EMAIL,
        subject,
        text: body,
      });
      return "delivered";
    } catch {
      return "smtp_failed_logged_locally";
    }
  }
  return "recorded_to_audit_log";
}

// Send User Request Email function
async function sendUserRequestEmail(data) {
  const {
    name = "Anonymous Citizen",
    email = "Not provided",
    phone = "Not provided",
    requestType = "General Assistance",
    subject = "Assistance Request",
    message = "",
    ...additionalFields
  } = data;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const emailSubject = `New User Request - ${requestType}`;

  let additionalInfo = "";
  const extraKeys = Object.keys(additionalFields).filter(
    (k) => !["clientTimestamp", "timestamp", "targetEmail"].includes(k)
  );
  if (extraKeys.length > 0) {
    additionalInfo = "\nADDITIONAL DETAILS\n" + extraKeys.map((k) => `${k}: ${additionalFields[k]}`).join("\n") + "\n";
  }

  const body = `NEW USER REQUEST\n==================================================\n\nUSER DETAILS\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nREQUEST DETAILS\nRequest Type: ${requestType}\nSubject: ${subject}\nMessage: ${message}\n${additionalInfo}\nSUBMISSION\nDate: ${dateStr}\nTime: ${timeStr}\n\n==================================================\nAEGIS SYSTEM\nONLINE`;

  let deliveryStatus = "recorded_locally";
  let deliveryNote = "";

  if (mailTransport) {
    try {
      await mailTransport.sendMail({
        from: `"AEGIS Protection Dispatch" <${GMAIL_USER || "requests@aegis-defense.io"}>`,
        to: ADMIN_EMAIL,
        replyTo: email.includes("@") ? email : undefined,
        subject: emailSubject,
        text: body,
      });
      deliveryStatus = "delivered_via_smtp";
    } catch (mailErr) {
      deliveryStatus = "smtp_failed";
    }
  }

  if (deliveryStatus !== "delivered_via_smtp") {
    try {
      const fsRes = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://aegis-defense.io",
          "Referer": "https://aegis-defense.io/",
          "User-Agent": "Mozilla/5.0 AEGIS-Server",
        },
        body: JSON.stringify({
          _subject: emailSubject,
          _captcha: "false",
          _template: "table",
          "Citizen Name": name,
          "Citizen Email": email,
          "Phone Number": phone,
          "Request Type": requestType,
          "Subject": subject,
          "Message Details": message,
          "Submission Date": dateStr,
          "Submission Time": timeStr,
          ...additionalFields,
        }),
      });

      const fsData = await fsRes.json();
      if (fsData.success === "true" || fsData.success === true) {
        deliveryStatus = "delivered_via_formsubmit";
      } else {
        deliveryStatus = "formsubmit_pending_activation";
        deliveryNote = fsData.message || "";
      }
    } catch (fsErr) {
      console.error("FormSubmit relay error:", fsErr);
    }
  }

  return { deliveryStatus, deliveryNote, dateStr, timeStr };
}

// Define routes supporting both /api/... and direct path /...
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ONLINE",
    system: "AEGIS PROTOCOL 2026",
    timestamp: new Date().toISOString(),
    developerNotificationTarget: DEVELOPER_NOTIFICATION_EMAIL,
    adminEmailTarget: ADMIN_EMAIL,
    adminConfigured: true,
  });
});

router.post("/request", async (req, res) => {
  try {
    const { name, email, phone, requestType, subject, message } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Please enter a valid email address." });
    }
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Please provide a message." });
    }

    const { deliveryStatus, deliveryNote, dateStr, timeStr } = await sendUserRequestEmail(req.body);
    const record = {
      id: `REQ-${Date.now()}`,
      name: name ? name.trim() : "Anonymous Citizen",
      email: email.trim(),
      phone: phone ? phone.trim() : "Not provided",
      requestType: requestType ? requestType.trim() : "General Assistance",
      subject: subject ? subject.trim() : "AEGIS Assistance",
      message: message.trim(),
      date: dateStr,
      time: timeStr,
      deliveryStatus,
      deliveryNote,
      targetEmail: ADMIN_EMAIL,
      timestamp: new Date().toISOString(),
    };
    appendToJsonArray(REQUESTS_FILE, record);

    res.json({
      success: true,
      message: "Request submitted successfully. We will get back to you soon.",
      requestId: record.id,
      deliveryStatus,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Unable to submit your request right now. Please try again." });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, language = "English", clientTimestamp } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const loginTime = clientTimestamp || new Date().toLocaleString();
    const sessionId = `AEGIS-SESS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let notificationStatus = "already_sent";
    if (!processedLogins.has(cleanEmail)) {
      processedLogins.add(cleanEmail);
      setTimeout(() => processedLogins.delete(cleanEmail), 5 * 60 * 1000);
      notificationStatus = await sendDeveloperNotification({ email: cleanEmail, sessionId, language, loginTime });
    }

    const sessionData = {
      sessionId,
      userEmail: cleanEmail,
      loginTime,
      language,
      notificationStatus,
      status: "AUTHENTICATED",
      lastActive: Date.now(),
    };
    sessions.set(sessionId, sessionData);

    appendToJsonArray(AUDIT_FILE, {
      eventType: "AEGIS_LOGIN",
      sessionId,
      userEmail: cleanEmail,
      timestamp: new Date().toISOString(),
      language,
      notificationStatus,
    });

    res.json({
      success: true,
      message: "IDENTITY VERIFIED",
      sessionId,
      userEmail: cleanEmail,
      token: `token_${sessionId}`,
      notificationSent: notificationStatus !== "already_sent",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal command center authentication error." });
  }
});

router.post("/auth/admin-login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (username?.trim() === ADMIN_USERNAME && password?.trim() === ADMIN_PASSWORD) {
      const adminToken = `admin_sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      res.json({
        success: true,
        message: "CLEARANCE GRANTED",
        adminToken,
        username: ADMIN_USERNAME,
        clearance: "LEVEL 5 COMMAND OVERWATCH",
        authenticatedAt: new Date().toISOString(),
      });
    } else {
      res.status(401).json({ success: false, error: "ACCESS DENIED: Invalid command credentials." });
    }
  } catch (err) {
    res.status(500).json({ error: "Server authentication error." });
  }
});

router.get("/admin/overview", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes("admin_sec_")) {
      return res.status(403).json({ error: "Unauthorized. Admin token required." });
    }

    const auditLog = readJsonArray(AUDIT_FILE);
    const feedbacks = readJsonArray(FEEDBACK_FILE);
    const requests = readJsonArray(REQUESTS_FILE);
    const activeSessionsList = Array.from(sessions.values());

    const totalRatings = feedbacks.length;
    const avgRating = totalRatings > 0
      ? (feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / totalRatings).toFixed(1)
      : "5.0";

    res.json({
      success: true,
      systemStatus: "OPTIMAL",
      threatLevel: "LOW",
      metrics: {
        activeSessionsCount: activeSessionsList.length,
        totalAuditLogins: auditLog.length,
        totalRequests: requests.length,
        totalFeedbacks: totalRatings,
        averageRating: avgRating,
        developerNotificationEmail: DEVELOPER_NOTIFICATION_EMAIL,
        adminEmailTarget: ADMIN_EMAIL,
      },
      activeSessions: activeSessionsList,
      requests: requests.slice(-50).reverse(),
      auditLog: auditLog.slice(-50).reverse(),
      feedbacks: feedbacks.slice(-50).reverse(),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load admin data." });
  }
});

router.post("/feedback", (req, res) => {
  try {
    const { sessionId, email, rating, feedback, timestamp } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5 stars." });
    }

    const feedbackRecord = {
      id: `FB-${Date.now()}`,
      sessionId: sessionId || "ANONYMOUS",
      email: email || "ANONYMOUS",
      rating: Number(rating),
      feedback: feedback ? feedback.trim() : "",
      timestamp: timestamp || new Date().toISOString(),
    };
    appendToJsonArray(FEEDBACK_FILE, feedbackRecord);

    res.json({ success: true, message: "FEEDBACK RECEIVED", data: feedbackRecord });
  } catch (err) {
    res.status(500).json({ error: "Failed to store feedback." });
  }
});

// Support both /api/* and /* paths
app.use("/api", router);
app.use("/", router);

export default app;
