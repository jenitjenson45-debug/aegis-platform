import React from "react";
import { Brain, Zap, Clock, ShieldCheck, LifeBuoy, Bot } from "lucide-react";

export const Features: React.FC = () => {
  const featureList = [
    {
      title: "SMART ASSISTANCE",
      desc: "Context-aware emergency detection prioritizing vulnerable sectors instantly.",
      icon: <Brain className="w-5 h-5 text-blue-400" />,
    },
    {
      title: "INTELLIGENT RESPONSE",
      desc: "Dynamic threat neutralization deploying defensive countermeasures tailored to situation.",
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: "REAL-TIME REQUESTS",
      desc: "Sub-millisecond packet telemetry with zero loss even under signal jamming.",
      icon: <Clock className="w-5 h-5 text-red-400" />,
    },
    {
      title: "SECURE COMMUNICATION",
      desc: "End-to-end encrypted voice and text transmission directly to AEGIS Command.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: "EMERGENCY SUPPORT",
      desc: "Instant beacon activation dispatching automated defense protocols to coordinate perimeters.",
      icon: <LifeBuoy className="w-5 h-5 text-amber-400" />,
    },
    {
      title: "AI-POWERED GUIDANCE",
      desc: "Real-time multilingual guidance in English and Malayalam for citizen safety.",
      icon: <Bot className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <section id="features" className="relative py-28 px-6 md:px-12 bg-[#050608]">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#C1123F] font-semibold">
            CAPABILITIES
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white font-sans">
            SYSTEM FEATURES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 space-y-3 group"
            >
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 w-fit group-hover:scale-110 group-hover:border-blue-500/40 transition-all">
                {f.icon}
              </div>
              <h3 className="text-base font-bold font-sans tracking-wide text-white">
                {f.title}
              </h3>
              <p className="text-sm text-[#8A99AD] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
