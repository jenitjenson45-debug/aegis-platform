import React from "react";
import { Shield, Zap, Eye, Terminal } from "lucide-react";

export const CharacterShowcase: React.FC = () => {
  const specs = [
    { label: "IDENTITY", value: "AEGIS", icon: <Shield className="w-4 h-4 text-blue-400" /> },
    { label: "STATUS", value: "ACTIVE", icon: <Zap className="w-4 h-4 text-emerald-400" /> },
    { label: "CLASS", value: "GUARDIAN", icon: <Terminal className="w-4 h-4 text-red-400" /> },
    { label: "RESPONSE", value: "RAPID (<60S)", icon: <Eye className="w-4 h-4 text-cyan-400" /> },
  ];

  return (
    <section id="showcase" className="relative py-28 px-6 md:px-12 bg-[#050608]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Image with scanning beam effect */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-blue-500/30 shadow-[0_0_40px_rgba(37,99,255,0.2)]">
            <img
              src="/assets/aegis-hero.jpg"
              alt="AEGIS Character Showcase"
              className="w-full h-full object-cover"
            />
            {/* Holographic scanning line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent h-24 animate-scanline pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between p-4 rounded-xl glass-pill border border-white/10">
              <span className="text-xs font-mono text-white tracking-widest font-bold">
                AEGIS THE GUARDIAN
              </span>
              <span className="text-[10px] font-mono text-emerald-300">
                SYSTEM ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Technical Dossier */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#2563FF] font-semibold">
              SPECIFICATION DOSSIER
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white font-sans mt-2">
              THE GUARDIAN
            </h2>
            <p className="text-sm text-[#8A99AD] font-sans mt-4 leading-relaxed">
              Forged through human discipline, unlocked by the ancient energy of the Core. AEGIS operates with athletic precision, an energy katana, and advanced tactical armor.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {specs.map((s) => (
              <div
                key={s.label}
                className="p-4 rounded-xl glass-panel border border-white/5 space-y-1.5"
              >
                <div className="flex items-center space-x-2">
                  {s.icon}
                  <span className="text-[10px] font-mono tracking-widest text-[#8A99AD]">
                    {s.label}
                  </span>
                </div>
                <div className="text-lg font-bold text-white font-mono">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
