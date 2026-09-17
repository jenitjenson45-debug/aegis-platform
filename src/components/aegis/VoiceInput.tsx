import React, { useState } from "react";
import { aegisVoice } from "../../speech/AegisVoiceService";
import { aegisAudio } from "../../audio/AegisAudioEngine";
import { LanguageCode } from "../../types/aegis";
import { Mic, MicOff, Send } from "lucide-react";
import { VoiceWaveform } from "./VoiceWaveform";

interface VoiceInputProps {
  language: LanguageCode;
  onSendMessage: (text: string, isVoice: boolean) => void;
  onListeningChange?: (listening: boolean) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  language,
  onSendMessage,
  onListeningChange,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  const handleToggleVoice = async () => {
    aegisAudio.ensureContext();
    if (isListening) {
      aegisVoice.stopListening();
      setIsListening(false);
      if (onListeningChange) onListeningChange(false);
      if (liveTranscript) {
        onSendMessage(liveTranscript, true);
        setLiveTranscript("");
      }
    } else {
      aegisAudio.playUiClick();
      aegisVoice.setLanguage(language);
      setIsListening(true);
      if (onListeningChange) onListeningChange(true);

      const success = await aegisVoice.startListening(
        (text, isFinal) => {
          setLiveTranscript(text);
          if (isFinal) {
            onSendMessage(text, true);
            setLiveTranscript("");
            setIsListening(false);
            if (onListeningChange) onListeningChange(false);
          }
        },
        (err) => {
          console.warn("Voice input notice:", err);
          setIsListening(false);
          if (onListeningChange) onListeningChange(false);
        }
      );

      if (!success) {
        setIsListening(false);
        if (onListeningChange) onListeningChange(false);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    aegisAudio.playUiClick();
    onSendMessage(inputText.trim(), false);
    setInputText("");
  };

  return (
    <div className="w-full space-y-2">
      {/* Live Voice Waveform / Speech Bubble Indicator */}
      {isListening && (
        <div className="flex items-center justify-center space-x-3 pb-1">
          <VoiceWaveform isActive={isListening} />
          <span className="text-xs font-mono text-cyan-300 tracking-wider animate-pulse">
            {language === "ml" ? "ശ്രദ്ധിക്കുന്നു... സംസാരിക്കൂ" : "Listening... Speak naturally"}
          </span>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleFormSubmit} className="relative flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={isListening ? liveTranscript || "Listening to your voice..." : inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isListening}
            placeholder={
              language === "ml"
                ? "എന്താണ് സംഭവിച്ചതെന്ന് പറയൂ (അല്ലെങ്കിൽ മൈക്ക് അമർത്തുക)..."
                : "Tell AEGIS what happened or click the mic to speak..."
            }
            className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-[#0B0F14]/90 border border-white/10 text-sm text-white placeholder-[#8A99AD]/40 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 backdrop-blur-md font-sans transition-all"
          />
        </div>

        {/* Microphone Button */}
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-center ${
            isListening
              ? "bg-[#C1123F] border-[#C1123F] text-white shadow-[0_0_20px_#ff1744] scale-105 animate-pulse"
              : "bg-[#111820] border-white/10 text-[#8A99AD] hover:text-white hover:border-blue-500/40"
          }`}
          title={isListening ? "Stop listening" : "Tap to speak (Voice input)"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isListening}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#2563FF] to-[#C1123F] text-white disabled:opacity-30 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(37,99,255,0.3)] flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
