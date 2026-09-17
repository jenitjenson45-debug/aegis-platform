import React, { useEffect, useRef } from "react";
import { aegisVoice } from "../../speech/AegisVoiceService";

interface VoiceWaveformProps {
  isActive: boolean;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const data = aegisVoice.getAnalyserData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 18;
      const barWidth = canvas.width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        let val = 15;
        if (data && data.length > i) {
          val = (data[i * 2] / 255) * canvas.height;
        } else {
          // Procedural fallback oscillation
          val = Math.sin(Date.now() * 0.008 + i * 0.4) * (canvas.height * 0.35) + canvas.height * 0.4;
        }

        const height = Math.max(4, val);
        const y = (canvas.height - height) / 2;
        const x = i * (barWidth + 2);

        const grad = ctx.createLinearGradient(0, y, 0, y + height);
        grad.addColorStop(0, "#2563FF");
        grad.addColorStop(0.5, "#FFFFFF");
        grad.addColorStop(1, "#C1123F");

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, height);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center px-4 py-2 rounded-xl bg-[#050608]/80 border border-blue-500/40 backdrop-blur-md">
      <canvas ref={canvasRef} width={140} height={32} className="block" />
    </div>
  );
};
