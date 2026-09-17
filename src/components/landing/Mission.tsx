import React from "react";
import { Shield, Target, Cpu, Activity } from "lucide-react";

export const Mission: React.FC = () => {
  return (
    <section id="mission" className="relative py-28 px-6 md:px-12 bg-[#080D14] border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#C1123F] font-bold">
              MISSION / 001
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white font-sans mt-2">
              THE MISSION
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-blue-200/90 font-serif italic max-w-md">
            “Protection should never feel out of reach.”
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-[#2563FF]">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Universal Defense
            </h3>
            <p className="text-sm text-[#8A99AD] leading-relaxed">
              Every citizen deserves unwavering protection regardless of circumstance. AEGIS stands as the digital and physical line of defense.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-[#C1123F]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Intelligent Core
            </h3>
            <p className="text-sm text-[#8A99AD] leading-relaxed">
              Powered by the ancient AEGIS Core, combined with modern telemetry to detect danger before harm reaches innocent lives.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Rapid Response
            </h3>
            <p className="text-sm text-[#8A99AD] leading-relaxed">
              Sub-60 second response threshold with encrypted direct-channel communication and instantaneous perimeter deployment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
