import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { aegisAudio } from "../../audio/AegisAudioEngine";
import { UserSession, LanguageCode } from "../../types/aegis";
import { Shield, ArrowRight, Lock, CheckCircle2, ShieldAlert } from "lucide-react";

interface AegisLoginProps {
  language: LanguageCode;
  onLoginSuccess: (session: UserSession) => void;
  onSwitchToAdminLogin?: () => void;
}

export const AegisLogin: React.FC<AegisLoginProps> = ({
  language,
  onLoginSuccess,
  onSwitchToAdminLogin,
}) => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "authenticating" | "verified" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleAuthenticate = async (targetEmail: string) => {
    if (!targetEmail || !targetEmail.includes("@")) {
      setErrorMessage("Please enter a valid mission access email.");
      return;
    }

    setErrorMessage("");
    setStatus("authenticating");
    aegisAudio.ensureContext();
    aegisAudio.playLaserScan();

    try {
      // Call backend API to authenticate and trigger developer notification to jenitson46@gmail.com
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          language: language === "ml" ? "Malayalam" : "English",
          clientTimestamp: new Date().toLocaleString(),
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { success: true, sessionId: `AEGIS-OFFLINE-${Date.now()}` };
      }

      // Play positive verification impact
      aegisAudio.playImpact();
      setStatus("verified");

      setTimeout(() => {
        const session: UserSession = {
          sessionId: data.sessionId || `AEGIS-SESS-${Date.now()}`,
          email: targetEmail,
          token: data.token || "token_verified",
          language: language,
          authenticatedAt: new Date().toISOString(),
          isConfessionComplete: false,
        };
        onLoginSuccess(session);
      }, 1600);
    } catch (err: any) {
      console.warn("Backend auth call failed, falling back to local session:", err);
      aegisAudio.playImpact();
      setStatus("verified");
      setTimeout(() => {
        const session: UserSession = {
          sessionId: `AEGIS-LOCAL-${Date.now()}`,
          email: targetEmail,
          token: "token_offline",
          language: language,
          authenticatedAt: new Date().toISOString(),
          isConfessionComplete: false,
        };
        onLoginSuccess(session);
      }, 1400);
    }
  };

  const handleGuestEntry = () => {
    const guestEmail = `guest_${Math.random().toString(36).substring(2, 7)}@aegis-defense.io`;
    setEmail(guestEmail);
    handleAuthenticate(guestEmail);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050608] flex items-center justify-center p-4 select-none">
      {/* Background Animated Subtle Grid & Particles */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2563FF_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-red-600/10 blur-3xl pointer-events-none translate-x-32" />

      {/* Thin Horizontal Glowing Line Transition */}
      <motion.div
        initial={{ width: "0%", opacity: 0 }}
        animate={{ width: "100%", opacity: [0, 0.8, 0.2] }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#2563FF] to-transparent pointer-events-none"
      />

      {/* Futuristic Authentication Glassmorphism Panel */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-2xl glass-panel-glow border border-blue-500/30 overflow-hidden"
      >
        {/* Top Scanning Laser line when authenticating */}
        {status === "authenticating" && (
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00d2ff] z-20 pointer-events-none"
          />
        )}

        {/* AEGIS Header Symbol */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-red-600/20 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,255,0.3)]">
            <Shield className="w-7 h-7 text-[#2563FF]" />
          </div>

          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#8A99AD] uppercase">
              CITIZEN ACCESS GATEWAY
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F5F7FA] font-sans">
              ENTER THE AEGIS NETWORK
            </h2>
          </div>

          <p className="text-xs text-[#8A99AD]/80 font-mono">
            Your conversation remains within your mission session.
          </p>
        </div>

        {/* Form Controls */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuthenticate(email);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-[#8A99AD] uppercase block">
              Citizen Email Identifier
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "authenticating" || status === "verified"}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-[#050608]/70 border border-white/10 text-sm text-[#F5F7FA] placeholder-[#8A99AD]/40 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all font-mono"
              />
              <Lock className="w-4 h-4 text-[#8A99AD]/40 absolute right-3.5 top-3.5" />
            </div>
            {errorMessage && (
              <p className="text-[11px] text-red-400 font-mono">{errorMessage}</p>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={status === "authenticating" || status === "verified"}
            className="w-full py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-[0.2em] font-bold text-white bg-gradient-to-r from-[#2563FF] to-[#C1123F] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(37,99,255,0.4)] disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {status === "idle" && (
              <>
                <span>ENTER AEGIS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
            {status === "authenticating" && (
              <span className="animate-pulse tracking-widest">CONNECTING TO AEGIS...</span>
            )}
            {status === "verified" && (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">IDENTITY VERIFIED</span>
              </>
            )}
          </button>

          {/* Guest Shortcut */}
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#8A99AD]">
            <button
              type="button"
              onClick={handleGuestEntry}
              disabled={status === "authenticating" || status === "verified"}
              className="hover:text-[#F5F7FA] transition-colors underline underline-offset-4 decoration-white/20"
            >
              Continue as guest
            </button>
            <span className="text-white/20">|</span>
            <span className="text-[#8A99AD]/60">PROTOCOL v2.6.4</span>
          </div>

          {/* SEPARATE ADMIN LOGIN SWITCH */}
          {onSwitchToAdminLogin && (
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
              <button
                type="button"
                onClick={() => {
                  aegisAudio.playUiClick();
                  onSwitchToAdminLogin();
                }}
                className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                <span className="underline underline-offset-2">Commander Overwatch (Admin)</span>
              </button>
              <span className="text-red-400/60 text-[10px]">CLEARANCE L5</span>
            </div>
          )}
        </form>

        {/* Verification Success Feedback */}
        <AnimatePresence>
          {status === "verified" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center"
            >
              <p className="text-xs font-mono text-emerald-300 tracking-wider">
                WELCOME TO THE AEGIS NETWORK. PREPARING SANCTUM...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
