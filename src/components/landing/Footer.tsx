import React from "react";
import { Shield } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative py-12 px-6 md:px-12 bg-[#050608] border-t border-white/5 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className="font-sans font-bold tracking-widest text-sm text-white">AEGIS DEFENSE</span>
          <span className="text-[10px] font-mono text-[#8A99AD] pl-2 border-l border-white/10">
            THE SHIELD BETWEEN YOU AND THE IMPOSSIBLE
          </span>
        </div>

        <div className="flex items-center space-x-6 text-[11px] font-mono text-[#8A99AD]">
          <span>● AEGIS SYSTEM ONLINE</span>
          <span>© 2026 AEGIS PROTOCOL</span>
        </div>
      </div>
    </footer>
  );
};
