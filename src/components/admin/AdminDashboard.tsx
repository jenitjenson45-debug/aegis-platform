import React, { useState, useEffect } from "react";
import { AdminSession } from "../../types/aegis";
import { aegisAudio } from "../../audio/AegisAudioEngine";
import {
  ShieldAlert,
  Activity,
  Users,
  Star,
  Mail,
  RefreshCw,
  LogOut,
  MessageSquare,
  Radio,
  Clock,
  ExternalLink,
} from "lucide-react";

interface AdminDashboardProps {
  adminSession: AdminSession;
  onLogout: () => void;
  onEnterCitizenChat: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminSession,
  onLogout,
  onEnterCitizenChat,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"audits" | "feedbacks">("audits");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview", {
        headers: { Authorization: adminSession.adminToken },
      });
      const resData = await res.json();
      if (resData.success) {
        setData(resData);
      }
    } catch (err) {
      console.warn("Failed to load admin overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    aegisAudio.ensureContext();
    aegisAudio.playChapterTheme(0);
    loadData();
    const interval = setInterval(loadData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050608] text-[#F5F7FA] flex flex-col select-none">
      {/* Top Overwatch Navigation Header */}
      <header className="relative z-30 flex items-center justify-between px-6 py-4 border-b border-red-500/20 bg-[#0B0F14]/90 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/30 to-blue-600/20 border border-red-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(193,18,63,0.3)]">
            <ShieldAlert className="w-5 h-5 text-[#C1123F]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-sans font-black tracking-widest text-base text-white">
                AEGIS COMMAND OVERWATCH
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-[10px] font-mono text-red-400 font-bold">
                {adminSession.clearance}
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#8A99AD]">
              COMMANDER: <span className="text-white font-bold">{adminSession.username}</span> | STATUS: <span className="text-emerald-400 font-bold">SYSTEM OPTIMAL</span>
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              aegisAudio.playUiClick();
              loadData();
            }}
            className="p-2 rounded-xl glass-pill border border-white/10 hover:border-blue-500/40 text-[#8A99AD] hover:text-white transition-colors"
            title="Refresh telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          </button>

          <button
            onClick={() => {
              aegisAudio.playSwordHum();
              onEnterCitizenChat();
            }}
            className="px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 font-mono text-xs uppercase tracking-wider hover:bg-blue-600/30 transition-all flex items-center space-x-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open Citizen Sanctum</span>
          </button>

          <button
            onClick={() => {
              aegisAudio.playUiClick();
              onLogout();
            }}
            className="px-4 py-2 rounded-xl glass-pill border border-red-500/30 text-red-300 font-mono text-xs uppercase tracking-wider hover:bg-red-500/20 transition-all flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Overwatch Content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-blue-500/20 space-y-1">
            <div className="flex items-center justify-between text-[#8A99AD] text-xs font-mono">
              <span>TOTAL CITIZEN LOGINS</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black font-sans text-white">
              {data?.metrics?.totalAuditLogins || 0}
            </div>
            <p className="text-[10px] font-mono text-[#8A99AD]">
              Across all recorded mission sessions
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 space-y-1">
            <div className="flex items-center justify-between text-[#8A99AD] text-xs font-mono">
              <span>DEFENSE NETWORK</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black font-sans text-emerald-400">
              100% SECURE
            </div>
            <p className="text-[10px] font-mono text-emerald-300/80">
              Threat level: {data?.threatLevel || "LOW"}
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-amber-500/20 space-y-1">
            <div className="flex items-center justify-between text-[#8A99AD] text-xs font-mono">
              <span>AVERAGE RATING</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-3xl font-black font-sans text-amber-300">
              {data?.metrics?.averageRating || "5.0"} <span className="text-sm font-normal text-white/50">/ 5.0</span>
            </div>
            <p className="text-[10px] font-mono text-[#8A99AD]">
              Based on {data?.metrics?.totalFeedbacks || 0} reviews
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-purple-500/20 space-y-1">
            <div className="flex items-center justify-between text-[#8A99AD] text-xs font-mono">
              <span>DEVELOPER ALERT TARGET</span>
              <Mail className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-bold font-mono text-white truncate pt-2">
              {data?.metrics?.developerNotificationEmail || "jenitson46@gmail.com"}
            </div>
            <p className="text-[10px] font-mono text-purple-300/80">
              Dispatches upon successful user auth
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-3 border-b border-white/5 pb-3">
          <button
            onClick={() => setActiveTab("audits")}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all ${
              activeTab === "audits"
                ? "bg-red-600/20 border border-red-500/50 text-white font-bold shadow-[0_0_15px_rgba(193,18,63,0.3)]"
                : "text-[#8A99AD] hover:text-white"
            }`}
          >
            Citizen Auth & Audit Stream ({data?.auditLog?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("feedbacks")}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all ${
              activeTab === "feedbacks"
                ? "bg-blue-600/20 border border-blue-500/50 text-white font-bold shadow-[0_0_15px_rgba(37,99,255,0.3)]"
                : "text-[#8A99AD] hover:text-white"
            }`}
          >
            Ratings & Feedback Archive ({data?.feedbacks?.length || 0})
          </button>
        </div>

        {/* Tab 1: Audit Log Table */}
        {activeTab === "audits" && (
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono tracking-widest text-white uppercase font-bold flex items-center space-x-2">
                <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                <span>REAL-TIME CITIZEN AUTHENTICATION LOG</span>
              </h3>
              <span className="text-[11px] font-mono text-[#8A99AD]">Auto-updating</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#8A99AD] text-[10px] uppercase">
                    <th className="pb-3">Citizen Email</th>
                    <th className="pb-3">Session ID</th>
                    <th className="pb-3">Language</th>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Notification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.auditLog && data.auditLog.length > 0 ? (
                    data.auditLog.map((log: any, idx: number) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 text-white font-bold">{log.userEmail}</td>
                        <td className="py-3 text-[#8A99AD] text-[11px]">{log.sessionId}</td>
                        <td className="py-3 text-cyan-400">{log.language || "English"}</td>
                        <td className="py-3 text-[#8A99AD] text-[11px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.notificationStatus === "delivered" || log.notificationStatus === "recorded_to_audit_log"
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                                : "bg-blue-950/60 text-blue-400 border border-blue-500/30"
                            }`}
                          >
                            {log.notificationStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#8A99AD]">
                        No citizen sessions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Feedback & Ratings Stream */}
        {activeTab === "feedbacks" && (
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <h3 className="text-sm font-mono tracking-widest text-white uppercase font-bold flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>CITIZEN MISSION RATINGS & REVIEWS</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.feedbacks && data.feedbacks.length > 0 ? (
                data.feedbacks.map((fb: any) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-xl glass-panel border border-white/10 space-y-2 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= fb.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-white/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-[#8A99AD]">
                        {new Date(fb.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-white font-sans italic">
                      "{fb.feedback || "No written comment provided."}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8A99AD] pt-1 border-t border-white/5">
                      <span>User: {fb.email}</span>
                      <span>{fb.id}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-[#8A99AD] font-mono">
                  No citizen reviews submitted yet.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
