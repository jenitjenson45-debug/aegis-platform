import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { aegisAudio } from "../../audio/AegisAudioEngine";
import { aegisVoice } from "../../speech/AegisVoiceService";
import { LanguageCode } from "../../types/aegis";
import { Shield } from "lucide-react";

interface ConfessionFlowProps {
  language: LanguageCode;
  onTakeoverComplete: () => void;
}

export const ConfessionFlow: React.FC<ConfessionFlowProps> = ({
  language,
  onTakeoverComplete,
}) => {
  const [step, setStep] = useState<number>(0);
  // 0: quiet atmosphere & camera zoom in
  // 1: "Did you finish the confession?"
  // 2: pause
  // 3: "The next part will be handled by me."
  // 4: MISSION RECEIVED & climax impact
  // 5: finish

  useEffect(() => {
    // 0: Atmospheric stillness
    aegisAudio.ensureContext();
    aegisAudio.playChapterTheme(99);

    // 1: Question
    const t1 = setTimeout(() => {
      setStep(1);
      const q = language === "ml" ? "നിങ്ങൾ എല്ലാം പറഞ്ഞു കഴിഞ്ഞോ?" : "Did you finish the confession?";
      aegisVoice.speak(q, language);
    }, 1800);

    // 2: Pause
    const t2 = setTimeout(() => {
      setStep(2);
    }, 4500);

    // 3: The Climax statement
    const t3 = setTimeout(() => {
      setStep(3);
      aegisAudio.playImpact();
      aegisAudio.playSwordHum();
      const statement = language === "ml"
        ? "ഇനി ബാക്കി ഞാൻ നോക്കിക്കൊള്ളാം."
        : "The next part will be handled by me.";
      aegisVoice.speak(statement, language);
    }, 6200);

    // 4: Mission Received
    const t4 = setTimeout(() => {
      setStep(4);
      aegisAudio.playEnergySurge();
    }, 9500);

    // 5: Complete and transition to Rating Screen
    const t5 = setTimeout(() => {
      onTakeoverComplete();
    }, 12500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      aegisVoice.stopSpeaking();
    };
  }, [language, onTakeoverComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050608] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Background Character Focus with Dramatic Push-In */}
      <motion.div
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: step >= 3 ? 1.18 : 1.06, opacity: step >= 3 ? 0.95 : 0.6 }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/assets/aegis-hero.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/60 to-[#050608]" />
      </motion.div>

      {/* Atmospheric Volumetric Fog and Energy Seams */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,255,0.15),transparent_70%)] pointer-events-none" />

      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-2xl space-y-6">
        {/* Emblem Pulse */}
        <motion.div
          animate={{
            scale: step >= 3 ? [1, 1.25, 1] : 1,
            rotate: step >= 3 ? [0, 5, -5, 0] : 0,
          }}
          transition={{ duration: 1.2 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/30 to-red-600/30 border border-blue-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,255,0.5)]"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>

        {/* Dynamic Subtitle Sequence */}
        <div className="min-h-[140px] flex flex-col items-center justify-center">
          {step === 1 && (
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-2xl md:text-4xl font-sans font-bold text-slate-200 tracking-wide"
            >
              {language === "ml"
                ? "“നിങ്ങൾ എല്ലാം പറഞ്ഞു കഴിഞ്ഞോ?”"
                : "“Did you finish the confession?”"}
            </motion.h2>
          )}

          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-sans text-glow-crimson leading-tight">
                {language === "ml" ? (
                  <>“ഇനി ബാക്കി ഞാൻ നോക്കിക്കൊള്ളാം.”</>
                ) : (
                  <>
                    “THE NEXT PART
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-500">
                      WILL BE HANDLED BY ME.
                    </span>”
                  </>
                )}
              </h1>

              {step >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center space-x-3 text-xs font-mono tracking-[0.3em] text-cyan-300 uppercase pt-2"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>MISSION RECEIVED — PROTOCOL ENGAGED</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
