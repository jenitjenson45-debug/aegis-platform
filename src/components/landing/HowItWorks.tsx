import React from "react";
import { MessageSquare, Cpu, ShieldCheck } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "REQUEST",
      desc: "Tell AEGIS what happened via text, voice, or emergency signal in English or Malayalam.",
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
    },
    {
      num: "02",
      title: "ANALYZE",
      desc: "The intelligent Core evaluates telemetry, sector risk, and optimal defense measures.",
      icon: <Cpu className="w-6 h-6 text-red-400" />,
    },
    {
      num: "03",
      title: "RESPOND",
      desc: "The appropriate assistance or guardian protocol is immediately deployed to your location.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 px-6 md:px-12 bg-[#080D14] border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#2563FF] font-semibold">
            THE PROTOCOL
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white font-sans">
            HOW IT WORKS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className="relative p-8 rounded-2xl glass-panel border border-white/5 space-y-4 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black font-mono text-white/20">
                  {s.num}
                </span>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  {s.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold font-sans text-white tracking-wide">
                {s.title}
              </h3>
              <p className="text-sm text-[#8A99AD] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
