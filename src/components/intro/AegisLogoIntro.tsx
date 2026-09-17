import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { aegisAudio } from "../../audio/AegisAudioEngine";

interface AegisLogoIntroProps {
  onComplete: () => void;
}

export const AegisLogoIntro: React.FC<AegisLogoIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0); // 0: black, 1: particles, 2: emblem assemble, 3: wordmark, 4: system init, 5: finish
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Stage 1: Particles spawn & deep sound starts
    const t1 = setTimeout(() => {
      setStage(1);
      aegisAudio.ensureContext();
      aegisAudio.playChapterTheme(0);
    }, 600);

    // Stage 2: Emblem formation
    const t2 = setTimeout(() => {
      setStage(2);
      aegisAudio.playEnergySurge();
    }, 2400);

    // Stage 3: Wordmark & Tagline reveal
    const t3 = setTimeout(() => {
      setStage(3);
      aegisAudio.playSwordHum();
    }, 4200);

    // Stage 4: "AEGIS SYSTEM INITIALIZING..."
    const t4 = setTimeout(() => {
      setStage(4);
      aegisAudio.playLaserScan();
    }, 6000);

    // Stage 5: Transition to Hero
    const t5 = setTimeout(() => {
      onComplete();
    }, 7800);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  // Procedural canvas particles converging to center
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes
    const particleCount = 140;
    const particles = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.max(width, height) * 0.7 + 100;
      return {
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        targetX: width / 2 + (Math.random() - 0.5) * 160,
        targetY: height / 2 + (Math.random() - 0.5) * 160,
        speed: 0.015 + Math.random() * 0.02,
        size: 1 + Math.random() * 2.2,
        color: Math.random() > 0.4 ? "#2563FF" : Math.random() > 0.5 ? "#C1123F" : "#FFFFFF",
        alpha: 0.1 + Math.random() * 0.7,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      // Draw faint geometric lines between close particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i += 3) {
        for (let j = i + 1; j < particles.length; j += 4) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 65) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(37, 99, 255, 0.15)";
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#050608] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Radial Atmospheric Lighting */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-900/15 via-transparent to-red-900/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated 3D AEGIS Emblem Construction */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-[0_0_25px_rgba(37,99,255,0.6)]"
                >
                  <defs>
                    <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563FF" />
                      <stop offset="50%" stopColor="#F5F7FA" />
                      <stop offset="100%" stopColor="#C1123F" />
                    </linearGradient>
                    <linearGradient id="innerEnergy" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00d2ff" />
                      <stop offset="100%" stopColor="#ff1744" />
                    </linearGradient>
                  </defs>

                  {/* Outer Shield Shell */}
                  <motion.path
                    d="M60 12 L98 30 L98 64 C98 86 82 103 60 110 C38 103 22 86 22 64 L22 30 Z"
                    stroke="url(#shieldBorder)"
                    strokeWidth="3.5"
                    fill="rgba(11, 15, 20, 0.7)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                  />

                  {/* Inner Angular Core Geometry */}
                  <motion.path
                    d="M60 28 L84 42 L60 92 L36 42 Z"
                    stroke="url(#innerEnergy)"
                    strokeWidth="2.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, delay: 0.3 }}
                  />

                  {/* Pulsing Crystalline Core Center */}
                  <motion.circle
                    cx="60"
                    cy="52"
                    r="8"
                    fill="#F5F7FA"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  />
                  <motion.circle
                    cx="60"
                    cy="52"
                    r="14"
                    stroke="#C1123F"
                    strokeWidth="1.5"
                    fill="none"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand Wordmark & Headline */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="space-y-3"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-[0.25em] text-[#F5F7FA] font-sans drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                AEGIS
              </h1>
              <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-[#8A99AD] font-mono">
                THE SHIELD BETWEEN <span className="text-[#2563FF]">YOU</span> AND THE <span className="text-[#C1123F]">IMPOSSIBLE</span>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Initializing Status */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mt-8 flex items-center space-x-3 px-4 py-1.5 rounded-full bg-[#111820]/80 border border-blue-500/30 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono tracking-widest text-[#F5F7FA]">
                AEGIS SYSTEM INITIALIZING...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
        className="absolute bottom-8 right-8 text-[11px] tracking-widest uppercase font-mono text-[#8A99AD]/60 hover:text-white transition-colors duration-200 px-3 py-1 rounded border border-white/10 hover:border-white/30"
      >
        Skip Intro [Esc]
      </button>
    </div>
  );
};
