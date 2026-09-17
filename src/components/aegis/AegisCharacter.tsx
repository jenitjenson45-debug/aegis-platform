import React from "react";
import { motion } from "framer-motion";

interface AegisCharacterProps {
  state: "idle" | "listening" | "thinking" | "speaking";
  audioLevel?: number;
}

export const AegisCharacter: React.FC<AegisCharacterProps> = ({
  state,
  audioLevel = 0,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none overflow-hidden">
      {/* Background Volumetric Glow behind AEGIS */}
      <motion.div
        animate={{
          scale: state === "speaking" ? [1, 1.15, 1] : state === "listening" ? [1, 1.08, 1] : [1, 1.03, 1],
          opacity: state === "speaking" ? 0.8 : 0.45,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-red-600/25 blur-3xl pointer-events-none"
      />

      {/* Main Character Image & Alive Animation Frame */}
      <motion.div
        animate={{
          y: state === "listening" ? [0, -6, 0] : [0, -10, 0],
          scale: state === "speaking" ? 1.03 : 1.0,
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 w-full max-w-[550px] h-[75vh] md:h-[88vh]"
      >
        <img
          src="/assets/aegis-chamber.jpg"
          alt="AEGIS Sanctuary"
          className="w-full h-full object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        />

        {/* Dynamic Eye Glow / Visor Slit Overlay */}
        <div
          className={`absolute top-[28.5%] left-[47.5%] w-5 h-1 rounded-full blur-[1px] transition-all duration-300 ${
            state === "listening"
              ? "bg-[#00d2ff] shadow-[0_0_15px_#00d2ff] opacity-100 scale-125"
              : state === "speaking"
              ? "bg-[#ff1744] shadow-[0_0_15px_#ff1744] opacity-100 scale-125"
              : "bg-[#2563FF] shadow-[0_0_8px_#2563FF] opacity-80"
          }`}
        />

        {/* Katana Blade Subtle Energy Crackle */}
        <div
          className={`absolute bottom-[22%] left-[34%] w-32 h-1 rotate-[-30deg] blur-[1px] transition-opacity duration-500 ${
            state === "speaking"
              ? "bg-gradient-to-r from-blue-400 via-white to-red-500 opacity-90 shadow-[0_0_18px_#2563FF]"
              : "bg-gradient-to-r from-blue-500/40 to-transparent opacity-40"
          }`}
        />
      </motion.div>

      {/* Character State Status Ribbon */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center space-x-3 px-4 py-2 rounded-full glass-panel border border-white/10">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            state === "speaking"
              ? "bg-red-500 animate-ping"
              : state === "listening"
              ? "bg-cyan-400 animate-pulse"
              : state === "thinking"
              ? "bg-amber-400 animate-spin"
              : "bg-emerald-400"
          }`}
        />
        <span className="text-[11px] font-mono tracking-widest text-[#F5F7FA] uppercase">
          AEGIS: {state === "speaking" ? "SPEAKING..." : state === "listening" ? "LISTENING..." : state === "thinking" ? "ANALYZING..." : "ONLINE"}
        </span>
      </div>
    </div>
  );
};
