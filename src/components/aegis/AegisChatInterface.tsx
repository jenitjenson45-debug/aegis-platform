import React, { useState, useEffect, useRef } from "react";
import { UserSession, ChatMessage, LanguageCode } from "../../types/aegis";
import { AegisCharacter } from "./AegisCharacter";
import { MessageBubble } from "./MessageBubble";
import { VoiceInput } from "./VoiceInput";
import { LanguageSelector } from "./LanguageSelector";
import { aegisVoice } from "../../speech/AegisVoiceService";
import { aegisAudio } from "../../audio/AegisAudioEngine";
import { Shield, Volume2, VolumeX, AlertCircle, Sparkles } from "lucide-react";

interface AegisChatInterfaceProps {
  session: UserSession;
  onInitiateConfessionClimax: () => void;
}

export const AegisChatInterface: React.FC<AegisChatInterfaceProps> = ({
  session,
  onInitiateConfessionClimax,
}) => {
  const [language, setLanguage] = useState<LanguageCode>(session.language || "en");
  const [characterState, setCharacterState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(aegisAudio.getMuted());
  const [hasConfessed, setHasConfessed] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Initial Welcome message on enter
  useEffect(() => {
    aegisAudio.ensureContext();
    aegisAudio.playChapterTheme(10); // Subtle guardian ambience

    const initialText =
      language === "ml"
        ? "സ്വാഗതം. നിങ്ങൾ ഇവിടം വരെ എത്തി. ഞാൻ ശ്രദ്ധിക്കുന്നു. നിങ്ങളെ ഇവിടെ എത്തിച്ച കാര്യം എന്നോട് പറയൂ."
        : "Welcome. You made it this far. I'm listening. Tell me what brought you here.";

    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "aegis",
      text: initialText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([welcomeMsg]);

    // Speak welcome
    setCharacterState("speaking");
    aegisVoice.speak(
      initialText,
      language,
      () => setCharacterState("speaking"),
      () => setCharacterState("idle")
    );
  }, [language]);

  // Auto scroll messages to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, characterState]);

  // Intelligent guardian response logic for English and Malayalam
  const generateAegisResponse = (input: string, lang: LanguageCode): string => {
    const lower = input.toLowerCase();

    // Malayalam detection / response
    if (lang === "ml" || /[\u0D00-\u0D7F]/.test(input) || lower.includes("macha") || lower.includes("entha")) {
      if (lower.includes("help") || lower.includes("സഹായം") || lower.includes("രക്ഷിക്കൂ")) {
        return "ഭയപ്പെടേണ്ട. ഞാൻ നിങ്ങളുടെ സംരക്ഷണത്തിലുണ്ട്. അപകടം എവിടെയാണെന്ന് പറയൂ. AEGIS നെറ്റ്‌വർക്ക് തയ്യാറാണ്.";
      }
      if (lower.includes("ആരാണ്") || lower.includes("who")) {
        return "ഞാൻ AEGIS. അസാധ്യമായതിനും നിങ്ങൾക്കും ഇടയിലുള്ള കവചം. നിങ്ങളെ കേൾക്കാനും സംരക്ഷിക്കാനും ഞാൻ ഇവിടെയുണ്ട്.";
      }
      if (lower.includes("confess") || lower.includes("പറയാനുണ്ട്") || lower.includes("സത്യം")) {
        return "ധൈര്യമായി പറയൂ. എല്ലാം ഒരുമിച്ച് പറയണമെന്നില്ല. നിങ്ങളുടെ ഓരോ വാക്കും ഞാൻ കേൾക്കുന്നുണ്ട്.";
      }
      return "നിങ്ങൾ പറഞ്ഞത് ഞാൻ ശ്രദ്ധിച്ചു. ധൈര്യമായിരിക്കുക, ഈ ദൗത്യം ഞാൻ ഏറ്റെടുക്കുന്നു.";
    }

    // English responses
    if (lower.includes("confess") || lower.includes("guilt") || lower.includes("mistake") || lower.includes("truth") || lower.includes("sorry")) {
      setHasConfessed(true);
      return "Take your time. You don't need to carry the weight alone anymore. I am listening to every word.";
    }
    if (lower.includes("help") || lower.includes("danger") || lower.includes("threat") || lower.includes("attack") || lower.includes("urgent")) {
      return "Threat telemetry detected in your sector. Keep your position secure. The AEGIS protocol is deployed to protect you.";
    }
    if (lower.includes("who are you") || lower.includes("what is aegis") || lower.includes("identity")) {
      return "I was once an ordinary man who refused to stand by. The AEGIS Core granted the power, but discipline guides the sword. I am the shield between you and the impossible.";
    }
    if (lower.includes("how does it work") || lower.includes("how it works")) {
      return "Three stages: You speak or submit your call. The system processes the threat and coordinates the defensive perimeter. Then, I respond directly.";
    }

    // General empathetic guardian response
    return "I hear you clearly. Keep speaking if there is more on your mind. When you are ready to conclude, I will take over.";
  };

  const handleSendMessage = (text: string, isVoice: boolean = false) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      isVoice,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setCharacterState("thinking");
    aegisAudio.playLaserScan();

    // Mark as potential confession if lengthy or meaningful
    if (text.length > 25 || text.toLowerCase().includes("confess") || text.toLowerCase().includes("help")) {
      setHasConfessed(true);
    }

    setTimeout(() => {
      const reply = generateAegisResponse(text, language);
      const aegisMsg: ChatMessage = {
        id: `aegis-${Date.now()}`,
        sender: "aegis",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aegisMsg]);
      setCharacterState("speaking");
      aegisAudio.playSwordHum();

      aegisVoice.speak(
        reply,
        language,
        () => setCharacterState("speaking"),
        () => setCharacterState("idle")
      );
    }, 1200);
  };

  const handleQuickAction = (actionText: string) => {
    aegisAudio.playUiClick();
    handleSendMessage(actionText);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050608] flex flex-col select-none">
      {/* TOP COMMAND HEADER */}
      <header className="relative z-30 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#080D14]/80 backdrop-blur-md">
        {/* Left: Brand & Status */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#2563FF]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-sans font-bold tracking-wider text-sm text-white">AEGIS AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-300">ONLINE</span>
            </div>
            <p className="text-[10px] font-mono text-[#8A99AD] hidden md:block">
              LOGGED IN AS: <span className="text-white">{session.email}</span>
            </p>
          </div>
        </div>

        {/* Right: Controls & Lock indicator */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-[10px] font-mono text-red-300">
            <AlertCircle className="w-3 h-3" />
            <span>SESSION ACTIVE — SECURED</span>
          </div>

          <LanguageSelector
            currentLanguage={language}
            onChange={(newLang) => {
              aegisAudio.playUiClick();
              setLanguage(newLang);
              aegisVoice.setLanguage(newLang);
            }}
          />

          <button
            onClick={() => {
              const m = aegisAudio.toggleMute();
              setIsMuted(m);
            }}
            className="p-2 rounded-full glass-pill border border-white/10 text-white/80 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>
        </div>
      </header>

      {/* MAIN SANCTUM BODY: 3D CHARACTER + CHAT STREAM */}
      <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT / CENTER: AEGIS 3D CHARACTER */}
        <div className="w-full md:w-1/2 lg:w-[55%] h-[35vh] md:h-full relative flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
          <AegisCharacter state={characterState} />
        </div>

        {/* RIGHT: CONVERSATION INTERFACE */}
        <div className="w-full md:w-1/2 lg:w-[45%] h-[65vh] md:h-full flex flex-col justify-between p-4 md:p-6 bg-[#080D14]/40">
          {/* Messages Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {characterState === "thinking" && (
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 py-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>AEGIS IS PROCESSING YOUR MESSAGE...</span>
              </div>
            )}
          </div>

          {/* Quick Actions & Complete Confession Trigger */}
          <div className="pt-3 pb-2 space-y-2.5">
            {/* Climax Trigger Button when user has spoken or wants to finish */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => handleQuickAction(language === "ml" ? "എനിക്ക് സഹായം വേണം." : "I need your protection.")}
                className="px-3 py-1.5 rounded-xl glass-pill border border-white/10 text-[#8A99AD] hover:text-white hover:border-blue-500/40 whitespace-nowrap font-mono text-[11px]"
              >
                {language === "ml" ? "സഹായം വേണം" : "Request Help"}
              </button>

              <button
                onClick={() => handleQuickAction(language === "ml" ? "എനിക്ക് നിന്നോട് ഒരു കാര്യം പറയാനുണ്ട്..." : "I have something to confess...")}
                className="px-3 py-1.5 rounded-xl glass-pill border border-white/10 text-[#8A99AD] hover:text-white hover:border-red-500/40 whitespace-nowrap font-mono text-[11px]"
              >
                {language === "ml" ? "ഒരു കാര്യം പറയാനുണ്ട്" : "Confess Something"}
              </button>

              <button
                onClick={() => handleQuickAction(language === "ml" ? "നീ ആരാണ്?" : "Who are you?")}
                className="px-3 py-1.5 rounded-xl glass-pill border border-white/10 text-[#8A99AD] hover:text-white hover:border-blue-500/40 whitespace-nowrap font-mono text-[11px]"
              >
                {language === "ml" ? "ആരാണ് നീ?" : "Who is AEGIS?"}
              </button>
            </div>

            {/* MAJOR CONFESSION COMPLETION ACTION BUTTON */}
            {hasConfessed && (
              <button
                onClick={() => {
                  aegisAudio.playImpact();
                  onInitiateConfessionClimax();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600/30 via-red-600/50 to-blue-600/30 border border-red-500/60 text-white font-mono text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(193,18,63,0.4)] hover:brightness-110 active:scale-[0.99] transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>COMPLETE CONFESSION & ENGAGE AEGIS</span>
              </button>
            )}

            {/* Voice and Text Input Controller */}
            <VoiceInput
              language={language}
              onSendMessage={handleSendMessage}
              onListeningChange={(isList) => {
                setCharacterState(isList ? "listening" : "idle");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
