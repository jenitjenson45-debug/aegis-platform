import React, { useState } from "react";
import { Shield, Menu, X, Radio, ShieldAlert } from "lucide-react";
import { aegisAudio } from "../../audio/AegisAudioEngine";

interface NavbarProps {
  onAccessAegis: () => void;
  onWatchMovie: () => void;
  onAccessAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAccessAegis,
  onWatchMovie,
  onAccessAdmin,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "HOME", href: "#hero" },
    { label: "MISSION", href: "#mission" },
    { label: "AEGIS", href: "#showcase" },
    { label: "HOW IT WORKS", href: "#how-it-works" },
    { label: "FEATURES", href: "#features" },
    { label: "REQUEST HELP", href: "#request-help" },
  ];

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-6xl">
      <div className="glass-pill px-5 py-3 rounded-full border border-white/10 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {/* Left: Brand */}
        <a href="#hero" className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600/30 to-red-600/30 border border-white/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#2563FF]" />
          </div>
          <span className="font-sans font-extrabold tracking-widest text-sm text-white">AEGIS</span>
        </a>

        {/* Center: Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-6 text-[11px] font-mono tracking-widest text-[#8A99AD]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              aegisAudio.playUiClick();
              onWatchMovie();
            }}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
          >
            <Radio className="w-3 h-3 animate-pulse" />
            <span>ORIGIN MOVIE</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {onAccessAdmin && (
            <button
              onClick={() => {
                aegisAudio.playUiClick();
                onAccessAdmin();
              }}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full glass-pill border border-red-500/30 text-red-400 hover:text-red-300 text-[10px] font-mono tracking-wider transition-colors"
              title="Commander Overwatch (Admin Portal)"
            >
              <ShieldAlert className="w-3 h-3 text-red-500" />
              <span>ADMIN</span>
            </button>
          )}

          <button
            onClick={() => {
              aegisAudio.playSwordHum();
              onAccessAegis();
            }}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#2563FF] to-[#C1123F] text-white text-[11px] font-mono tracking-widest font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(37,99,255,0.4)]"
          >
            ACCESS AEGIS
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 rounded-full text-white/80 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden mt-3 p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-xs font-mono tracking-widest text-[#8A99AD] hover:text-white py-1.5"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              onWatchMovie();
            }}
            className="w-full text-left text-xs font-mono tracking-widest text-cyan-400 py-1.5"
          >
            &gt; PLAY ORIGIN MOVIE
          </button>
          {onAccessAdmin && (
            <button
              onClick={() => {
                setMobileOpen(false);
                onAccessAdmin();
              }}
              className="w-full text-left text-xs font-mono tracking-widest text-red-400 py-1.5 flex items-center space-x-2 border-t border-white/5 pt-2"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>&gt; COMMANDER OVERWATCH (ADMIN LOGIN)</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
