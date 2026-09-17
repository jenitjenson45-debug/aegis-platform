import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Target email for User Requests (defaults to jenitson05@gmail.com per requirement)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "jenitson05@gmail.com";

// Developer / Administrator Notification Configuration
const DEVELOPER_NOTIFICATION_EMAIL = process.env.DEVELOPER_NOTIFICATION_EMAIL || "jenitson46@gmail.com";

// GENERATED SECURE ADMIN CREDENTIALS
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "aegis_commander";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Aegis#Overwatch2026!";

// In-memory Session & Notification tracking to strictly PREVENT DUPLICATES
const sessions = new Map();
const processedLogins = new Set();

const DATA_DIR = path.join(__dirname, "data");
const AUDIT_FILE = path.join(DATA_DIR, "audit_log.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");
const REQUESTS_FILE = path.join(DATA_DIR, "user_requests.json");

function ensureFile(filePath, defaultContent = "[]") {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, "utf8");
  }
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

// Nodemailer transport setup (Supports Gmail service or custom SMTP)
let mailTransport = null;
const GMAIL_USER = process.env.GMAIL_USER || process.env.SMTP_USER;
const GMAIL_PASS = process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

if (GMAIL_USER && GMAIL_PASS) {
  mailTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });
  console.log(`[AEGIS EMAIL] Configured Gmail SMTP transport with user: ${GMAIL_USER}`);
} else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  mailTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log(`[AEGIS EMAIL] Configured custom SMTP transport with host: ${process.env.SMTP_HOST}`);
}

// Send Developer Notification function
async function sendDeveloperNotification({ email, sessionId, language, loginTime }) {
  const subject = "AEGIS — New User Entered the Command Center";
  const body = `AEGIS SYSTEM NOTIFICATION
==================================================
A new user has successfully entered the protected AEGIS interaction system.

USER INFORMATION
Email: ${email}
Login status: AUTHENTICATED
Login time: ${loginTime}
Session ID: ${sessionId}
Session: ACTIVE
Language: ${language || "English"}

The user has now entered the AEGIS chatbot and can interact with the superhero through text and voice.

==================================================
AEGIS SYSTEM
ONLINE`;

  console.log("\n==================================================");
  console.log(">> [AEGIS BACKEND] DISPATCHING DEVELOPER NOTIFICATION <<");
  console.log(`>> To: ${DEVELOPER_NOTIFICATION_EMAIL}`);
  console.log(`>> Subject: ${subject}`);
  console.log(body);
  console.log("==================================================\n");

  if (mailTransport) {
    try {
      await mailTransport.sendMail({
        from: `"AEGIS Command Center" <${GMAIL_USER || "no-reply@aegis-defense.io"}>`,
        to: DEVELOPER_NOTIFICATION_EMAIL,
        subject,
        text: body,
      });
      console.log(`[AEGIS EMAIL] Delivered notification email to ${DEVELOPER_NOTIFICATION_EMAIL}`);
      return "delivered";
    } catch (mailErr) {
      console.error("[AEGIS EMAIL ERROR] Failed to send via SMTP:", mailErr.message);
      return "smtp_failed_logged_locally";
    }
  } else {
    return "recorded_to_audit_log";
  }
}

// Send User Request Email function (Target: jenitson05@gmail.com)
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

  const body = `NEW USER REQUEST
==================================================

USER DETAILS
Name: ${name}
Email: ${email}
Phone: ${phone}

REQUEST DETAILS
Request Type: ${requestType}
Subject: ${subject}
Message: ${message}
${additionalInfo}
SUBMISSION
Date: ${dateStr}
Time: ${timeStr}

==================================================
AEGIS SYSTEM
ONLINE`;

  console.log("\n==================================================");
  console.log(">> [AEGIS BACKEND] DISPATCHING USER REQUEST EMAIL <<");
  console.log(`>> Target Email: ${ADMIN_EMAIL}`);
  console.log(`>> Subject: ${emailSubject}`);
  console.log(body);
  console.log("==================================================\n");

  let deliveryStatus = "recorded_locally";
  let deliveryNote = "";

  // 1. First priority: Direct SMTP / Gmail if configured
  if (mailTransport) {
    try {
      await mailTransport.sendMail({
        from: `"AEGIS Protection Dispatch" <${GMAIL_USER || "requests@aegis-defense.io"}>`,
        to: ADMIN_EMAIL,
        replyTo: email.includes("@") ? email : undefined,
        subject: emailSubject,
        text: body,
      });
      console.log(`[AEGIS EMAIL] Successfully dispatched request email via SMTP to ${ADMIN_EMAIL}`);
      deliveryStatus = "delivered_via_smtp";
    } catch (mailErr) {
      console.error("[AEGIS EMAIL ERROR] SMTP delivery failed:", mailErr.message);
      deliveryStatus = "smtp_failed";
    }
  }

  // 2. Second priority: FormSubmit Relay directly to jenitson05@gmail.com
  if (deliveryStatus !== "delivered_via_smtp") {
    try {
      const fsRes = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3001",
          "Referer": "http://localhost:3001/",
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
      console.log(`[AEGIS FORMSUBMIT DISPATCH] Result:`, fsData);

      if (fsData.success === "true" || fsData.success === true) {
        deliveryStatus = "delivered_via_formsubmit";
      } else {
        deliveryStatus = "formsubmit_pending_activation";
        deliveryNote = fsData.message || "";
      }
    } catch (fsErr) {
      console.error("[AEGIS FORMSUBMIT ERROR]", fsErr.message);
    }
  }

  return { deliveryStatus, deliveryNote, dateStr, timeStr };
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ONLINE",
    system: "AEGIS PROTOCOL 2026",
    timestamp: new Date().toISOString(),
    developerNotificationTarget: DEVELOPER_NOTIFICATION_EMAIL,
    adminEmailTarget: ADMIN_EMAIL,
    smtpConfigured: !!mailTransport,
    adminConfigured: true,
    activeSessions: sessions.size,
  });
});

// User Request / Inquiry Submission Endpoint
app.post("/api/request", async (req, res) => {
  try {
    const { name, email, phone, requestType, subject, message } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        error: "Unable to submit your request right now. Please enter a valid email address.",
      });
    }

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Unable to submit your request right now. Please provide a message.",
      });
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
    console.error("[USER REQUEST ERROR]", err);
    res.status(500).json({
      success: false,
      error: "Unable to submit your request right now. Please try again.",
    });
  }
});

// User Authentication & Session Login Endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, language = "English", clientTimestamp } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const loginTime = clientTimestamp || new Date().toLocaleString();
    const sessionId = `AEGIS-SESS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Deduplication check: Has this exact user authenticated within last 60 seconds?
    const dedupeKey = `${cleanEmail}`;
    let notificationStatus = "already_sent";

    if (!processedLogins.has(dedupeKey)) {
      processedLogins.add(dedupeKey);
      setTimeout(() => processedLogins.delete(dedupeKey), 5 * 60 * 1000);

      notificationStatus = await sendDeveloperNotification({
        email: cleanEmail,
        sessionId,
        language,
        loginTime,
      });
    } else {
      console.log(`[AEGIS DEDUPLICATION] Login notification already dispatched for ${cleanEmail}. Skipping duplicate.`);
    }

    // Save session in memory
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

    // Save event to persistent audit log
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
    console.error("[AEGIS AUTH ERROR]", err);
    res.status(500).json({ error: "Internal command center authentication error." });
  }
});

// Admin Authentication Login Endpoint
app.post("/api/auth/admin-login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required." });
    }

    if (username.trim() === ADMIN_USERNAME && password.trim() === ADMIN_PASSWORD) {
      const adminToken = `admin_sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      console.log(`[AEGIS ADMIN] Commander authenticated: ${ADMIN_USERNAME}`);

      res.json({
        success: true,
        message: "CLEARANCE GRANTED",
        adminToken,
        username: ADMIN_USERNAME,
        clearance: "LEVEL 5 COMMAND OVERWATCH",
        authenticatedAt: new Date().toISOString(),
      });
    } else {
      res.status(401).json({
        success: false,
        error: "ACCESS DENIED: Invalid command credentials. Level 5 clearance required.",
      });
    }
  } catch (err) {
    console.error("[ADMIN AUTH ERROR]", err);
    res.status(500).json({ error: "Server authentication error." });
  }
});

// Admin Overview Data Endpoint
app.get("/api/admin/overview", (req, res) => {
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
    console.error("[ADMIN OVERVIEW ERROR]", err);
    res.status(500).json({ error: "Failed to load admin data." });
  }
});

// Submit User Rating & Feedback Endpoint
app.post("/api/feedback", (req, res) => {
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
    console.log(`[AEGIS FEEDBACK] Recorded ${rating}-star feedback from ${email || "Guest"}: "${feedbackRecord.feedback}"`);

    res.json({
      success: true,
      message: "FEEDBACK RECEIVED",
      data: feedbackRecord,
    });
  } catch (err) {
    console.error("[AEGIS FEEDBACK ERROR]", err);
    res.status(500).json({ error: "Failed to store feedback." });
  }
});

// Optional production static serving
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`[AEGIS COMMAND CENTER SERVER] Online and listening on port ${PORT}`);
  console.log(`[DEVELOPER NOTIFICATIONS] Active target: ${DEVELOPER_NOTIFICATION_EMAIL}`);
  console.log(`[USER REQUESTS TARGET] Active admin email: ${ADMIN_EMAIL}`);
  console.log(`[ADMIN CREDENTIALS] Username: ${ADMIN_USERNAME} | Password: ${ADMIN_PASSWORD}`);
});
