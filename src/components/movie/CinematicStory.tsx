import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MovieChapter } from "../../types/aegis";
import { aegisAudio } from "../../audio/AegisAudioEngine";
import { aegisVoice } from "../../speech/AegisVoiceService";
import { Volume2, VolumeX, SkipForward, ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";

interface CinematicStoryProps {
  onComplete: () => void;
  onExploreLanding: () => void;
}

const CHAPTERS: MovieChapter[] = [
  {
    id: 1,
    chapterNumber: "CHAPTER 01",
    title: "BEFORE THE SHIELD",
    subtitle: "THE HUMAN ORIGIN",
    narration: [
      "Before AEGIS became a guardian, he was simply human.",
      "He had no extraordinary strength. No armor. No weapon worthy of legend.",
      "Only a choice."
    ],
    imageSrc: "/assets/aegis-before-shield.jpg",
    mood: "Emotional, quiet, human",
    audioTheme: "human_piano",
    cameraMovement: "dolly-in",
    focalQuote: "“Before the shield... there was only a man.”"
  },
  {
    id: 2,
    chapterNumber: "CHAPTER 02",
    title: "THE DISCIPLINE",
    subtitle: "FORGING THE BODY & WILL",
    narration: [
      "He trained because he refused to stand by while others suffered.",
      "Endless repetitions in rain, dawn, and dusk. Pain transformed into balance.",
      "A slim human physique gradually refined into lean athletic endurance."
    ],
    imageSrc: "/assets/aegis-training.jpg",
    mood: "Determination, building rhythm",
    audioTheme: "discipline_rhythm",
    cameraMovement: "pan-right",
    focalQuote: "“Power is not given. It is earned through discipline.”"
  },
  {
    id: 3,
    chapterNumber: "CHAPTER 03",
    title: "THE CORE",
    subtitle: "THE ANCIENT DISCOVERY",
    narration: [
      "Deep in an ancient subterranean sanctum, something had been waiting.",
      "The AEGIS Core: a mysterious geometric energy sphere pulsing with pure plasma.",
      "A power designed to respond only to a heart capable of bearing its weight."
    ],
    imageSrc: "/assets/aegis-core.jpg",
    mood: "Mysterious, ancient, awe-inspiring",
    audioTheme: "core_mystic",
    cameraMovement: "dolly-in",
    focalQuote: "“Beyond the reach of ordinary men, destiny lay waiting.”"
  },
  {
    id: 4,
    chapterNumber: "CHAPTER 04",
    title: "THE AWAKENING",
    subtitle: "SYNCHRONIZATION",
    narration: [
      "His hand touched the Core. Silence.",
      "Then... an explosive shockwave surged through his body.",
      "Heartbeat synchronized with the plasma core: BOOM. BOOM. BOOM.",
      "Luminous energy flooded his nervous system."
    ],
    imageSrc: "/assets/aegis-awakening.jpg",
    mood: "Supernatural, intense energy build",
    audioTheme: "awakening_surge",
    cameraMovement: "orbit",
    focalQuote: "“Silence broke. The Core woke him.”"
  },
  {
    id: 5,
    chapterNumber: "CHAPTER 05",
    title: "THE BIRTH OF AEGIS",
    subtitle: "THE TRANSFORMATION",
    narration: [
      "His shoulders broadened. Muscle definition locked into an enhanced warrior form.",
      "High-tech composite navy armor snapped into place with crimson glowing seams.",
      "His signature bun held firm. The cybernetic visor sealed over his face.",
      "The katana crackled to life with plasma fire. AEGIS WAS BORN."
    ],
    imageSrc: "/assets/aegis-transformation.jpg",
    mood: "Epic superhero orchestral reveal",
    audioTheme: "heroic_reveal",
    cameraMovement: "dolly-out",
    focalQuote: "“On that day, the human became AEGIS.”"
  },
  {
    id: 6,
    chapterNumber: "CHAPTER 06",
    title: "THE AEGIS PROTOCOL",
    subtitle: "10 GUARDIAN ABILITIES",
    narration: [
      "The Core unlocked capabilities far beyond normal human comprehension.",
      "Every ability calibrated for defense, rescue, and decisive protection."
    ],
    imageSrc: "/assets/aegis-hero.jpg",
    mood: "Hybrid electronic action",
    audioTheme: "powers_action",
    cameraMovement: "pan-left",
    focalQuote: "“10 Protocols. One Purpose: Total Protection.”",
    powers: [
      { name: "01 / Enhanced Strength", desc: "Arrests vehicular impacts & structural collapses", tag: "STRENGTH" },
      { name: "02 / Kinetic Speed", desc: "Sub-millisecond rapid traversal with motion dampening", tag: "VELOCITY" },
      { name: "03 / Hyper Reflexes", desc: "Pre-empts projectile trajectories before point of impact", tag: "REACTION" },
      { name: "04 / Energy Manipulation", desc: "Channels blue/crimson plasma into directed barriers", tag: "PLASMA" },
      { name: "05 / AEGIS Shield", desc: "Hard-light polyhedral defense field stopping heavy firepower", tag: "DEFENSE" },
      { name: "06 / Reinforced Durability", desc: "Composite micro-mesh dissipates kinetic shockwaves", tag: "ARMOR" },
      { name: "07 / Combat Mastery", desc: "Surgical tactical mastery in close quarters & blade combat", tag: "MARTIAL" },
      { name: "08 / Energy Katana", desc: "Plasma blade slicing through reinforced steel obstacles", tag: "WEAPON" },
      { name: "09 / Threat Sense", desc: "Detects emotional distress & thermal hostility in sector", tag: "RADAR" },
      { name: "10 / Rapid Response", desc: "Dispatches protection in under 60 seconds from call", tag: "DISPATCH" }
    ]
  },
  {
    id: 7,
    chapterNumber: "CHAPTER 07",
    title: "THE COST OF POWER",
    subtitle: "CONTROL OVER WRATH",
    narration: [
      "Power without control is not protection.",
      "Unbridled energy causes strain and destructive instability.",
      "AEGIS mastered the Core through breath and calm, choosing restraint over destruction."
    ],
    imageSrc: "/assets/aegis-transformation.jpg",
    mood: "Dark atmospheric tension",
    audioTheme: "control_tension",
    cameraMovement: "dolly-in",
    focalQuote: "“A true guardian protects with discipline, never cruelty.”"
  },
  {
    id: 8,
    chapterNumber: "CHAPTER 08",
    title: "THE FIRST CALL",
    subtitle: "A CRY IN THE DARK",
    narration: [
      "In the rain-slicked city streets, everyday citizens faced danger.",
      "A young mother. A laborer. An elder. A distress signal lit the sky.",
      "AEGIS System received the telemetry: THREAT DETECTED. RESPONDING."
    ],
    imageSrc: "/assets/aegis-people-call.jpg",
    mood: "Human tension, digital emergency",
    audioTheme: "first_request",
    cameraMovement: "pan-right",
    focalQuote: "“Protection should never be out of reach.”"
  },
  {
    id: 9,
    chapterNumber: "CHAPTER 09",
    title: "PEOPLE APPROACH AEGIS",
    subtitle: "THE LISTENING GUARDIAN",
    narration: [
      "They did not come looking for a myth or an untouchable god.",
      "They came looking for someone who would listen.",
      "AEGIS stood among them: First listen. Then assess. Then protect."
    ],
    imageSrc: "/assets/aegis-people-call.jpg",
    mood: "Warmth, emotional connection",
    audioTheme: "people_hope",
    cameraMovement: "dolly-out",
    focalQuote: "“They came looking for someone who would listen.”"
  },
  {
    id: 10,
    chapterNumber: "CHAPTER 10",
    title: "THE GUARDIAN REVEAL",
    subtitle: "THE SHIELD ANSWERS",
    narration: [
      "He was once one of them. Now he stands between them and the impossible.",
      "When the world calls for a shield... AEGIS answers.",
      "Now that you know who I am... it is time to tell me why you came."
    ],
    imageSrc: "/assets/aegis-hero.jpg",
    mood: "Heroic peak, transition to direct encounter",
    audioTheme: "guardian_theme",
    cameraMovement: "dolly-in",
    focalQuote: "“Now that you know who I am... it's time to tell me why you came.”"
  }
];

export const CinematicStory: React.FC<CinematicStoryProps> = ({
  onComplete,
  onExploreLanding,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(aegisAudio.getMuted());
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const autoPlayTimer = useRef<number | null>(null);

  const chapter = CHAPTERS[currentIdx];

  // Play chapter audio & narration
  useEffect(() => {
    aegisAudio.ensureContext();
    aegisAudio.playChapterTheme(chapter.id);

    if (voiceEnabled) {
      const fullNarration = chapter.narration.join(" ");
      aegisVoice.speak(fullNarration, "en");
    }

    // Auto-advance timer (8-10 seconds per chapter)
    if (isAutoPlay) {
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
      const delay = chapter.id === 6 ? 13000 : 9000;
      autoPlayTimer.current = window.setTimeout(() => {
        if (currentIdx < CHAPTERS.length - 1) {
          setCurrentIdx((prev) => prev + 1);
        } else {
          // Finished Chapter 10 -> Transition to Login
          handleFinishMovie();
        }
      }, delay);
    }

    return () => {
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
      aegisVoice.stopSpeaking();
    };
  }, [currentIdx, isAutoPlay, voiceEnabled]);

  const handleNext = () => {
    aegisAudio.playUiClick();
    if (currentIdx < CHAPTERS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      handleFinishMovie();
    }
  };

  const handlePrev = () => {
    aegisAudio.playUiClick();
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleFinishMovie = () => {
    aegisAudio.playImpact();
    onComplete();
  };

  const toggleSound = () => {
    const muted = aegisAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050608] select-none">
      {/* Background Cinematic Scene Image with Camera Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{
            opacity: 1,
            scale: chapter.cameraMovement === "dolly-in" ? 1.02 : 1.06,
            x: chapter.cameraMovement === "pan-right" ? -15 : chapter.cameraMovement === "pan-left" ? 15 : 0,
          }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${chapter.imageSrc})`,
          }}
        >
          {/* Cinematic Vignette & Color Grading */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/40 to-[#050608]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/90 via-transparent to-[#050608]/80" />
        </motion.div>
      </AnimatePresence>

      {/* Volumetric Lighting & Film Grain */}
      <div className="absolute inset-0 pointer-events-none film-grain opacity-40" />

      {/* TOP BAR NAVIGATION */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6 md:px-12">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-mono font-bold text-[#F5F7FA] text-xs">
            AE
          </div>
          <span className="font-sans font-bold tracking-widest text-lg text-white">AEGIS</span>
          <span className="text-[10px] font-mono text-[#8A99AD] tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10">
            CINEMATIC ARCHIVE
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-full glass-pill text-white/80 hover:text-white border border-white/10 hover:border-blue-500/40 transition-colors"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>

          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="p-2.5 rounded-full glass-pill text-white/80 hover:text-white border border-white/10 hover:border-blue-500/40 transition-colors"
            title={isAutoPlay ? "Pause Auto-play" : "Resume Auto-play"}
          >
            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleFinishMovie}
            className="flex items-center space-x-2 px-4 py-2 rounded-full glass-pill text-xs font-mono tracking-widest text-[#F5F7FA] border border-blue-500/30 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
          >
            <span>ENTER LOGIN</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CENTER / BOTTOM CONTENT NARRATIVE */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            {/* Chapter Header Tag */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#2563FF] font-semibold">
                {chapter.chapterNumber}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8A99AD]">
                {chapter.subtitle}
              </span>
            </div>

            {/* Chapter Title */}
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#F5F7FA] font-sans">
              {chapter.title}
            </h2>

            {/* Focal Quote if present */}
            {chapter.focalQuote && (
              <p className="text-lg md:text-xl italic font-serif text-blue-200/90 max-w-2xl border-l-2 border-[#2563FF] pl-4">
                {chapter.focalQuote}
              </p>
            )}

            {/* Synchronized Narration Paragraphs */}
            <div className="space-y-2 max-w-2xl">
              {chapter.narration.map((line, i) => (
                <p key={i} className="text-sm md:text-base text-[#F5F7FA]/90 font-sans leading-relaxed">
                  {line}
                </p>
              ))}
            </div>

            {/* CHAPTER 06: POWERS GRID OVERLAY */}
            {chapter.powers && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-4 max-w-3xl"
              >
                {chapter.powers.map((p, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-2.5 rounded-lg glass-panel border border-white/5 hover:border-blue-500/40 transition-colors"
                  >
                    <span className="text-[9px] font-mono text-[#2563FF] tracking-widest block uppercase">
                      {p.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      {p.name.split("/ ")[1] || p.name}
                    </h4>
                    <p className="text-[10px] text-[#8A99AD] line-clamp-2 mt-0.5">
                      {p.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM CONTROLS & TIMELINE INDICATOR */}
      <div className="absolute bottom-6 left-8 right-8 md:left-16 md:right-16 z-30 flex items-center justify-between">
        {/* Step Navigation Dots */}
        <div className="flex items-center space-x-1.5 md:space-x-2">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                aegisAudio.playUiClick();
                setCurrentIdx(idx);
              }}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === currentIdx
                  ? "w-8 bg-gradient-to-r from-blue-500 to-red-500"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              title={ch.title}
            />
          ))}
        </div>

        {/* Previous / Next buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="p-2 rounded-full glass-pill disabled:opacity-20 hover:bg-white/10 text-white border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono tracking-widest text-[#8A99AD] px-2">
            {currentIdx + 1} / {CHAPTERS.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 rounded-full glass-pill hover:bg-white/10 text-white border border-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
