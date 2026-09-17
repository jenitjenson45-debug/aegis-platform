import React from "react";
import { motion } from "framer-motion";
import { HUDCard } from "./HUDCard";
import { ArrowRight, Shield, Activity, Radio, Zap } from "lucide-react";
import { aegisAudio } from "../../audio/AegisAudioEngine";

interface HeroProps {
  onMeetAegis: () => void;
  onExploreMission: () => void;
  onWatchMovie: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onMeetAegis,
  onExploreMission,
  onWatchMovie,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-28 pb-16 px-6 md:px-12 bg-[#050608]"
    >
      {/* Oversized Background AEGIS Wordmark at low opacity */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[20vw] font-black tracking-widest text-white/[0.02] uppercase leading-none font-sans">
          AEGIS
        </span>
      </div>

      {/* Atmospheric Radial Gradients */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none top-1/4 right-1/4" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none bottom-1/4 left-1/4" />

      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Hero Content */}
        <div className="lg:col-span-6 space-y-6">
          {/* Status Indicator */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-blue-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#F5F7FA] uppercase font-bold">
              AEGIS SYSTEM ONLINE
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#2563FF] font-semibold block">
              THE NEXT GENERATION OF PROTECTION
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white font-sans leading-none">
              AEGIS
            </h1>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F5F7FA] font-sans pt-2 leading-tight">
              THE SHIELD BETWEEN
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-500">
                YOU AND THE IMPOSSIBLE.
              </span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[#8A99AD] font-sans max-w-lg leading-relaxed">
            Meet AEGIS — a next-generation superhero experience designed to connect people with protection, assistance, and intelligent support when they need it most.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                aegisAudio.playSwordHum();
                onMeetAegis();
              }}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#2563FF] to-[#C1123F] text-white font-mono text-xs uppercase tracking-widest font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(37,99,255,0.4)] flex items-center space-x-2.5"
            >
              <span>MEET AEGIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                aegisAudio.playUiClick();
                onExploreMission();
              }}
              className="px-6 py-3.5 rounded-full glass-pill border border-white/10 hover:border-white/30 text-white font-mono text-xs uppercase tracking-widest font-bold transition-all"
            >
              EXPLORE THE MISSION
            </button>

            <button
              onClick={() => {
                aegisAudio.playUiClick();
                onWatchMovie();
              }}
              className="px-5 py-3.5 rounded-full glass-pill border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-mono text-xs uppercase tracking-widest flex items-center space-x-2 transition-all"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>ORIGIN MOVIE</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Artwork + Floating HUD Cards */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="relative w-full max-w-[540px] aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            <img
              src="/assets/aegis-hero.jpg"
              alt="AEGIS Character"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent opacity-80" />

            {/* FLOATING HUD CARDS around the character */}
            {/* Card 1: Top Left */}
            <div className="absolute top-6 left-6 w-44">
              <HUDCard
                label="AEGIS STATUS"
                value="ONLINE"
                subtext="Protection Network Active"
                icon={<Activity className="w-4 h-4 text-emerald-400" />}
                accent="blue"
              />
            </div>

            {/* Card 2: Top Right */}
            <div className="absolute top-12 right-6 w-40">
              <HUDCard
                label="THREAT LEVEL"
                value="LOW"
                subtext="Area Secure"
                icon={<Shield className="w-4 h-4 text-blue-400" />}
                accent="white"
              />
            </div>

            {/* Card 3: Bottom Left */}
            <div className="absolute bottom-10 left-6 w-44">
              <HUDCard
                label="RESPONSE"
                value="< 60 SEC"
                subtext="Rapid Assistance"
                icon={<Zap className="w-4 h-4 text-red-400" />}
                accent="red"
              />
            </div>

            {/* Card 4: Bottom Right */}
            <div className="absolute bottom-6 right-6 w-44">
              <HUDCard
                label="NETWORK"
                value="ACTIVE"
                subtext="Connected Guardians"
                icon={<Radio className="w-4 h-4 text-cyan-400" />}
                accent="blue"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
