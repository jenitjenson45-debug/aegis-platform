import React, { useState } from "react";
import { motion } from "framer-motion";
import { aegisAudio } from "../../audio/AegisAudioEngine";
import { AdminSession } from "../../types/aegis";
import { ShieldAlert, Lock, User, Key, ArrowRight, ArrowLeft, Terminal, CheckCircle2 } from "lucide-react";

interface AegisAdminLoginProps {
  onAdminLoginSuccess: (session: AdminSession) => void;
  onSwitchToUserLogin: () => void;
}

export const AegisAdminLogin: React.FC<AegisAdminLoginProps> = ({
  onAdminLoginSuccess,
  onSwitchToUserLogin,
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "authenticating" | "verified" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Auto-fill the generated credentials for convenience
  const handleAutoFill = () => {
    setUsername("aegis_commander");
    setPassword("Aegis#Overwatch2026!");
    aegisAudio.playUiClick();
  };

  const handleAdminAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Enter commander username and clearance password.");
      return;
    }

    setErrorMessage("");
    setStatus("authenticating");
    aegisAudio.ensureContext();
    aegisAudio.playLaserScan();

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        aegisAudio.playImpact();
        setStatus("verified");

        setTimeout(() => {
          const session: AdminSession = {
            adminToken: data.adminToken,
            username: data.username,
            clearance: data.clearance,
            authenticatedAt: data.authenticatedAt,
          };
          onAdminLoginSuccess(session);
        }, 1200);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "ACCESS DENIED: Invalid command credentials.");
        aegisAudio.playImpact();
      }
    } catch {
      setStatus("error");
      setErrorMessage("Command network connection failure.");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050608] flex items-center justify-center p-4 select-none">
      {/* Background Volumetric Glow & Tech Grid */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C1123F_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute w-[550px] h-[550px] rounded-full bg-red-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none translate-x-40" />

      {/* Admin Command Portal Glassmorphism Panel */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-2xl glass-panel border border-red-500/40 shadow-[0_0_40px_rgba(193,18,63,0.25)] overflow-hidden"
      >
        {/* Top Scan Line during authentication */}
        {status === "authenticating" && (
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ff1744] z-20 pointer-events-none"
          />
        )}

        {/* Header Icon & Clearance Badge */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/30 to-blue-600/20 border border-red-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(193,18,63,0.4)]">
            <ShieldAlert className="w-7 h-7 text-[#C1123F]" />
          </div>

          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-red-400 font-bold uppercase flex items-center justify-center space-x-1">
              <Terminal className="w-3 h-3 mr-1" />
              LEVEL 5 SECURITY CLEARANCE
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans mt-1">
              COMMAND OVERWATCH
            </h2>
          </div>

          <p className="text-xs text-[#8A99AD] font-mono">
            Surveillance telemetry, citizen sessions & network control.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleAdminAuthenticate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-[#8A99AD] uppercase block">
              Commander Identity
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={status === "authenticating" || status === "verified"}
                placeholder="Enter commander username"
                className="w-full px-4 py-3 rounded-xl bg-[#050608]/80 border border-white/10 text-sm text-white placeholder-[#8A99AD]/40 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition-all font-mono"
              />
              <User className="w-4 h-4 text-[#8A99AD]/40 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-[#8A99AD] uppercase block">
              Clearance Cipher
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === "authenticating" || status === "verified"}
                placeholder="Enter clearance password"
                className="w-full px-4 py-3 rounded-xl bg-[#050608]/80 border border-white/10 text-sm text-white placeholder-[#8A99AD]/40 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition-all font-mono"
              />
              <Lock className="w-4 h-4 text-[#8A99AD]/40 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {errorMessage && (
            <p className="text-[11px] text-red-400 font-mono text-center">{errorMessage}</p>
          )}

          {/* Generated Credentials Quick Fill Box */}
          <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-red-300 font-bold">GENERATED CREDENTIALS:</span>
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center space-x-1"
              >
                <Key className="w-3 h-3" />
                <span>Auto-Fill</span>
              </button>
            </div>
            <div className="text-[10px] text-[#8A99AD] space-y-0.5">
              <div>User: <span className="text-white">aegis_commander</span></div>
              <div>Pass: <span className="text-white">Aegis#Overwatch2026!</span></div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "authenticating" || status === "verified"}
            className="w-full py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-[0.2em] font-bold text-white bg-gradient-to-r from-[#C1123F] to-[#2563FF] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(193,18,63,0.4)] disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {status === "idle" && (
              <>
                <span>AUTHENTICATE OVERWATCH</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
            {status === "authenticating" && (
              <span className="animate-pulse tracking-widest">VERIFYING CLEARANCE...</span>
            )}
            {status === "verified" && (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">CLEARANCE GRANTED</span>
              </>
            )}
            {status === "error" && <span>RETRY AUTHENTICATION</span>}
          </button>
        </form>

        {/* Switch back to User / Citizen Login */}
        <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={onSwitchToUserLogin}
            className="text-xs font-mono text-[#8A99AD] hover:text-white transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Citizen Access (User Login)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
