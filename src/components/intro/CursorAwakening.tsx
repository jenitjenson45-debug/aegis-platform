import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { aegisAudio } from "../../audio/AegisAudioEngine";

interface CursorAwakeningProps {
  onAwakenComplete: () => void;
  onExploreLanding: () => void;
}

export const CursorAwakening: React.FC<CursorAwakeningProps> = ({
  onAwakenComplete,
  onExploreLanding,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [movementDistance, setMovementDistance] = useState<number>(0);
  const [isAwakened, setIsAwakened] = useState<boolean>(false);
  const [activationProgress, setActivationProgress] = useState<number>(0);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  // Awakening threshold in pixels
  const THRESHOLD = 160;

  useEffect(() => {
    // Start dark ambient drone for the still frame
    aegisAudio.ensureContext();
    aegisAudio.playChapterTheme(0);

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normX = (e.clientX - centerX) / centerX;
      const normY = (e.clientY - centerY) / centerY;

      setMousePos({ x: normX, y: normY });

      if (lastMousePos.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        setMovementDistance((prev) => {
          const next = prev + dist;
          const prog = Math.min(100, Math.round((next / THRESHOLD) * 100));
          setActivationProgress(prog);

          if (next >= THRESHOLD && !isAwakened) {
            setIsAwakened(true);
            aegisAudio.playSwordHum();
            aegisAudio.playEnergySurge();
            setTimeout(() => {
              onAwakenComplete();
            }, 2000);
          }
          return next;
        });
      }
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Mobile touch support
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleMouseMove({
          clientX: touch.clientX,
          clientY: touch.clientY,
        } as unknown as MouseEvent);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isAwakened, onAwakenComplete]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050608] select-none cursor-crosshair">
      {/* LAYER 01: Background Deep Horizon */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 scale-105"
        style={{
          backgroundImage: `radial-gradient(circle at 60% 40%, #0B111A 0%, #050608 85%)`,
          transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -10}px, 0)`,
        }}
      />

      {/* LAYER 02: Atmospheric Moon / Cybernetic City Architecture & Sky */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          backgroundImage: `radial-gradient(ellipse at 70% 30%, rgba(37,99,255,0.25) 0%, transparent 60%)`,
          transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 0)`,
        }}
      />

      {/* LAYER 03 & 04: AEGIS Character Artwork with 3D Parallax */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-0 md:pr-12 lg:pr-24 pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * 22}px, ${mousePos.y * 18}px, 0) scale(${isAwakened ? 1.05 : 1})`,
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="relative w-full md:w-[68vw] lg:w-[58vw] h-[85vh] md:h-[95vh]">
          {/* Subtle Ambient Rim Glow behind character */}
          <div
            className={`absolute inset-0 rounded-3xl transition-opacity duration-700 blur-3xl pointer-events-none ${
              isAwakened
                ? "bg-gradient-to-r from-red-600/30 via-transparent to-blue-600/40 opacity-90"
                : "bg-gradient-to-r from-red-900/10 via-transparent to-blue-900/20 opacity-40"
            }`}
          />

          <img
            src="/assets/aegis-hero.jpg"
            alt="AEGIS Hero"
            className="w-full h-full object-contain md:object-cover rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] opacity-95 transition-all duration-700"
          />

          {/* LAYER 05: Sword Energy Plasma Line (animated overlay on blade) */}
          <div
            className={`absolute bottom-[18%] left-[10%] w-[38%] h-[2px] pointer-events-none transition-all duration-500 ${
              isAwakened
                ? "bg-gradient-to-r from-blue-400 via-white to-red-500 shadow-[0_0_25px_#00d2ff] opacity-100 rotate-[-22deg]"
                : "bg-gradient-to-r from-blue-500/40 via-transparent to-transparent opacity-30 rotate-[-22deg]"
            }`}
          />
        </div>
      </motion.div>

      {/* LAYER 06: Drifting Volumetric Fog & Cyberdust particles */}
      <div
        className="absolute inset-0 pointer-events-none film-grain opacity-60"
        style={{
          transform: `translate3d(${mousePos.x * 35}px, ${mousePos.y * 28}px, 0)`,
        }}
      />

      {/* LAYER 07: Foreground Minimal UI / Typography */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-16 pointer-events-none">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-3 glass-pill px-4 py-1.5 rounded-full border border-white/10">
            <span className={`w-2 h-2 rounded-full ${isAwakened ? "bg-[#C1123F] animate-ping" : "bg-[#2563FF]"}`} />
            <span className="text-[11px] font-mono tracking-widest text-[#8A99AD]">
              STATUS: {isAwakened ? "SYSTEM AWAKENING" : "MONITORING"}
            </span>
          </div>

          <button
            onClick={onExploreLanding}
            className="text-[11px] font-mono uppercase tracking-widest text-[#8A99AD] hover:text-white transition-colors glass-pill px-4 py-1.5 rounded-full border border-white/10 hover:border-blue-500/40"
          >
            Explore Landing Page &rarr;
          </button>
        </div>

        {/* Hero Left Typography */}
        <div className="max-w-xl space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-1"
          >
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#2563FF] font-semibold">
              CHAPTER 00 / AWAKENING
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-[#F5F7FA] font-sans">
              AEGIS
            </h1>
            <p className="text-lg md:text-xl font-medium tracking-wide text-[#8A99AD]">
              THE GUARDIAN
            </p>
          </motion.div>

          <p className="text-xs md:text-sm text-[#8A99AD]/80 font-mono max-w-md leading-relaxed hidden md:block">
            A next-generation superhero experience connecting humans with intelligent protection, assistance, and unwavering defense.
          </p>
        </div>

        {/* Bottom Instruction: MOVE TO BEGIN or ACTIVATING */}
        <div className="flex flex-col items-center justify-center pointer-events-auto pb-4">
          <AnimatePresence mode="wait">
            {!isAwakened ? (
              <motion.div
                key="instruction"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col items-center space-y-2.5 cursor-pointer"
                onClick={() => {
                  // Direct click awakening fallback
                  setIsAwakened(true);
                  aegisAudio.playSwordHum();
                  aegisAudio.playEnergySurge();
                  setTimeout(onAwakenComplete, 1600);
                }}
              >
                <div className="flex items-center space-x-3 px-5 py-2 rounded-full glass-panel border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,255,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-[#2563FF] animate-pulse" />
                  <span className="text-xs font-mono tracking-[0.25em] text-[#F5F7FA] font-semibold uppercase">
                    MOVE CURSOR TO BEGIN
                  </span>
                </div>

                {/* Progress bar for movement awakening */}
                <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-150"
                    style={{ width: `${activationProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#8A99AD]/60 uppercase">
                  Touch / Move to awaken system ({activationProgress}%)
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="activated"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center space-y-2 text-center"
              >
                <div className="flex items-center space-x-3 px-6 py-2 rounded-full bg-[#C1123F]/20 border border-[#C1123F]/60 backdrop-blur-md shadow-[0_0_30px_rgba(193,18,63,0.4)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C1123F] animate-ping" />
                  <span className="text-xs font-mono tracking-[0.3em] text-[#F5F7FA] font-bold uppercase">
                    AEGIS SYSTEM ACTIVATION
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[#8A99AD] tracking-widest uppercase animate-pulse">
                  ENTERING ORIGIN SEQUENCE...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
