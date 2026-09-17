import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { aegisAudio } from "../../audio/AegisAudioEngine";
import { Shield } from "lucide-react";

export const AegisStandby: React.FC = () => {
  const [phase, setPhase] = useState<number>(0);
  // 0: Thank you & tagline
  // 1: Logo fades to deep black
  // 2: Final minimal STANDBY

  useEffect(() => {
    aegisAudio.ensureContext();
    aegisAudio.playChapterTheme(0); // Very low ambient drone

    const t1 = setTimeout(() => setPhase(1), 4000);
    const t2 = setTimeout(() => setPhase(2), 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#050608] flex flex-col items-center justify-center p-6 text-center select-none">
      {phase < 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: phase === 0 ? 1 : 0.2, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="space-y-6 max-w-lg"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600/30 to-red-600/30 border border-blue-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,255,0.4)]">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-[#F5F7FA] font-sans">
              AEGIS
            </h1>
            <p className="text-xs md:text-sm font-mono tracking-[0.25em] text-[#8A99AD] uppercase">
              THE SHIELD BETWEEN YOU AND THE IMPOSSIBLE.
            </p>
          </div>

          <p className="text-sm font-sans text-slate-300 tracking-wide pt-2">
            THANK YOU FOR BEING PART OF THE AEGIS STORY.
          </p>
        </motion.div>
      )}

      {phase === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="space-y-4"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500/60 mx-auto animate-pulse" />
          <div className="space-y-1">
            <p className="text-[11px] font-mono tracking-[0.4em] text-[#8A99AD] uppercase">
              MISSION COMPLETE
            </p>
            <p className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase">
              AEGIS SYSTEM STANDBY
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
