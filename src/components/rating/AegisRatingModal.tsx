import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { aegisAudio } from "../../audio/AegisAudioEngine";
import { UserSession } from "../../types/aegis";
import { Shield, Send, CheckCircle2 } from "lucide-react";

interface AegisRatingModalProps {
  session: UserSession | null;
  onFinish: () => void;
}

const RATING_MESSAGES: Record<number, string> = {
  1: "WE'LL WORK TO DO BETTER.",
  2: "THANK YOU FOR THE HONEST FEEDBACK.",
  3: "THANK YOU FOR YOUR FEEDBACK.",
  4: "WE'RE GLAD YOU ENJOYED THE EXPERIENCE.",
  5: "THANK YOU FOR BELIEVING IN AEGIS.",
};

export const AegisRatingModal: React.FC<AegisRatingModalProps> = ({
  session,
  onFinish,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const activeStar = hoverRating || rating;

  const handleSelectStar = (stars: number) => {
    setRating(stars);
    aegisAudio.playRatingChime(stars);
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    aegisAudio.playLaserScan();

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session?.sessionId || "ANONYMOUS",
          email: session?.email || "ANONYMOUS",
          rating,
          feedback: feedbackText,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn("Feedback backend error:", err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      aegisAudio.playImpact();
      setTimeout(() => {
        onFinish();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050608] flex items-center justify-center p-4 select-none">
      {/* Background Volumetric Glow & Subtle Grid */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-red-600/10 blur-3xl pointer-events-none translate-y-32" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg p-8 md:p-10 rounded-2xl glass-panel-glow border border-blue-500/30 text-center space-y-6"
      >
        {/* Top Shield Emblem */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600/20 to-red-600/20 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,255,0.4)]">
          <Shield className="w-7 h-7 text-[#2563FF]" />
        </div>

        <div>
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#8A99AD] uppercase">
            MISSION CONCLUSION
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F5F7FA] font-sans mt-1">
            HOW WAS YOUR AEGIS EXPERIENCE?
          </h2>
        </div>

        {/* 5 Interactive Custom SVG Stars */}
        <div className="flex items-center justify-center space-x-3 py-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= activeStar;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleSelectStar(star)}
                className="p-1 transition-transform duration-200 hover:scale-125 focus:outline-none"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-9 h-9 md:w-11 md:h-11 transition-all duration-300 ${
                    isFilled
                      ? "fill-[#2563FF] stroke-[#00d2ff] filter drop-shadow-[0_0_12px_#00d2ff]"
                      : "fill-transparent stroke-white/30 hover:stroke-white/60"
                  }`}
                  strokeWidth="1.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Dynamic Response Text for Selected Stars */}
        <div className="min-h-[28px]">
          <AnimatePresence mode="wait">
            {activeStar > 0 && (
              <motion.p
                key={activeStar}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase"
              >
                {RATING_MESSAGES[activeStar]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Optional Written Feedback */}
        {rating > 0 && !submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3 pt-2 text-left"
          >
            <label className="text-[11px] font-mono tracking-wider text-[#8A99AD] block">
              Want to tell us more?
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your thoughts about your AEGIS experience..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#050608]/80 border border-white/10 text-sm text-white placeholder-[#8A99AD]/40 focus:outline-none focus:border-blue-500/60 font-sans resize-none"
            />
          </motion.div>
        )}

        {/* Action Buttons */}
        {!submitted ? (
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={onFinish}
              className="flex-1 py-3 px-4 rounded-xl glass-pill text-xs font-mono tracking-widest text-[#8A99AD] hover:text-white border border-white/10"
            >
              SKIP
            </button>

            <button
              onClick={handleSubmitFeedback}
              disabled={rating === 0 || isSubmitting}
              className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#2563FF] to-[#C1123F] text-white font-mono text-xs uppercase tracking-widest font-bold disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(37,99,255,0.4)] flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>TRANSMITTING...</span>
              ) : (
                <>
                  <span>SUBMIT FEEDBACK</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1"
          >
            <div className="flex items-center justify-center space-x-2 text-emerald-400 font-mono text-xs font-bold tracking-widest">
              <CheckCircle2 className="w-4 h-4" />
              <span>FEEDBACK RECEIVED</span>
            </div>
            <p className="text-[11px] font-mono text-slate-300 tracking-wider">
              THANK YOU FOR HELPING AEGIS EVOLVE.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
