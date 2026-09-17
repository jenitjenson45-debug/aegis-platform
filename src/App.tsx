import React, { useState } from "react";
import { AppPhase, UserSession, AdminSession, LanguageCode } from "./types/aegis";
import { AegisLogoIntro } from "./components/intro/AegisLogoIntro";
import { CursorAwakening } from "./components/intro/CursorAwakening";
import { CinematicStory } from "./components/movie/CinematicStory";
import { AegisLogin } from "./components/auth/AegisLogin";
import { AegisAdminLogin } from "./components/auth/AegisAdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AegisChatInterface } from "./components/aegis/AegisChatInterface";
import { ConfessionFlow } from "./components/aegis/ConfessionFlow";
import { AegisRatingModal } from "./components/rating/AegisRatingModal";
import { AegisStandby } from "./components/rating/AegisStandby";
import { Navbar } from "./components/hero/Navbar";
import { Hero } from "./components/hero/Hero";
import { Mission } from "./components/landing/Mission";
import { CharacterShowcase } from "./components/landing/CharacterShowcase";
import { HowItWorks } from "./components/landing/HowItWorks";
import { Features } from "./components/landing/Features";
import { RequestHelp } from "./components/landing/RequestHelp";
import { Footer } from "./components/landing/Footer";

export const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>("LOGO_INTRO");
  const [session, setSession] = useState<UserSession | null>(null);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");

  return (
    <div className="relative min-h-screen bg-[#050608] text-[#F5F7FA] overflow-x-hidden select-none">
      {/* 01: LOGO INTRO OVERLAY */}
      {phase === "LOGO_INTRO" && (
        <AegisLogoIntro
          onComplete={() => {
            setPhase("CURSOR_AWAKENING");
          }}
        />
      )}

      {/* 02: HERO STILL FRAME + CURSOR AWAKENING TRIGGER */}
      {phase === "CURSOR_AWAKENING" && (
        <CursorAwakening
          onAwakenComplete={() => {
            setPhase("ORIGIN_MOVIE");
          }}
          onExploreLanding={() => {
            setPhase("LANDING_EXPLORE");
          }}
        />
      )}

      {/* 03: 11-CHAPTER CINEMATIC ORIGIN MOVIE */}
      {phase === "ORIGIN_MOVIE" && (
        <CinematicStory
          onComplete={() => {
            setPhase("LOGIN");
          }}
          onExploreLanding={() => {
            setPhase("LANDING_EXPLORE");
          }}
        />
      )}

      {/* 04: LANDING EXPLORE MODE */}
      {phase === "LANDING_EXPLORE" && (
        <div className="min-h-screen flex flex-col justify-between">
          <Navbar
            onAccessAegis={() => setPhase("LOGIN")}
            onWatchMovie={() => setPhase("ORIGIN_MOVIE")}
            onAccessAdmin={() => setPhase("ADMIN_LOGIN")}
          />
          <Hero
            onMeetAegis={() => setPhase("LOGIN")}
            onExploreMission={() => {
              const el = document.getElementById("mission");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onWatchMovie={() => setPhase("ORIGIN_MOVIE")}
          />
          <Mission />
          <CharacterShowcase />
          <HowItWorks />
          <Features />
          <RequestHelp onRequestAegis={() => setPhase("LOGIN")} />
          <Footer />
        </div>
      )}

      {/* 05-A: SECURE USER / CITIZEN LOGIN */}
      {phase === "LOGIN" && (
        <AegisLogin
          language={currentLanguage}
          onLoginSuccess={(newSession) => {
            setSession(newSession);
            setCurrentLanguage(newSession.language);
            setPhase("AEGIS_ROOM");
          }}
          onSwitchToAdminLogin={() => {
            setPhase("ADMIN_LOGIN");
          }}
        />
      )}

      {/* 05-B: SEPARATE ADMIN COMMAND OVERWATCH LOGIN */}
      {phase === "ADMIN_LOGIN" && (
        <AegisAdminLogin
          onAdminLoginSuccess={(newAdminSession) => {
            setAdminSession(newAdminSession);
            setPhase("ADMIN_DASHBOARD");
          }}
          onSwitchToUserLogin={() => {
            setPhase("LOGIN");
          }}
        />
      )}

      {/* 05-C: ADMIN COMMAND OVERWATCH DASHBOARD */}
      {phase === "ADMIN_DASHBOARD" && adminSession && (
        <AdminDashboard
          adminSession={adminSession}
          onLogout={() => {
            setAdminSession(null);
            setPhase("LOGIN");
          }}
          onEnterCitizenChat={() => {
            const commanderSession: UserSession = {
              sessionId: `AEGIS-OVERWATCH-SESS-${Date.now()}`,
              email: "aegis_commander@aegis-defense.io",
              token: adminSession.adminToken,
              language: "en",
              authenticatedAt: new Date().toISOString(),
              isConfessionComplete: false,
            };
            setSession(commanderSession);
            setPhase("AEGIS_ROOM");
          }}
        />
      )}

      {/* 06: PROTECTED AEGIS CHATROOM SANCTUM */}
      {phase === "AEGIS_ROOM" && session && (
        <AegisChatInterface
          session={session}
          onInitiateConfessionClimax={() => {
            setPhase("CONFESSION_FLOW");
          }}
        />
      )}

      {/* 07: CONFESSION CLIMAX */}
      {phase === "CONFESSION_FLOW" && (
        <ConfessionFlow
          language={currentLanguage}
          onTakeoverComplete={() => {
            setPhase("RATING_SCREEN");
          }}
        />
      )}

      {/* 08: 5-STAR RATING & FEEDBACK */}
      {phase === "RATING_SCREEN" && (
        <AegisRatingModal
          session={session}
          onFinish={() => {
            setPhase("STANDBY_SCREEN");
          }}
        />
      )}

      {/* 09: FINAL AEGIS SYSTEM STANDBY */}
      {phase === "STANDBY_SCREEN" && <AegisStandby />}
    </div>
  );
};
