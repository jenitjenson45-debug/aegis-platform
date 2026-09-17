import React from "react";
import { LanguageCode } from "../../types/aegis";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onChange: (lang: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onChange,
}) => {
  return (
    <div className="flex items-center space-x-1.5 p-1 rounded-full glass-pill border border-white/10 text-xs font-mono">
      <Globe className="w-3.5 h-3.5 text-[#8A99AD] ml-2" />
      <button
        onClick={() => onChange("en")}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          currentLanguage === "en"
            ? "bg-[#2563FF] text-white font-bold shadow-[0_0_10px_rgba(37,99,255,0.5)]"
            : "text-[#8A99AD] hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onChange("ml")}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          currentLanguage === "ml"
            ? "bg-[#C1123F] text-white font-bold shadow-[0_0_10px_rgba(193,18,63,0.5)]"
            : "text-[#8A99AD] hover:text-white"
        }`}
      >
        മലയാളം
      </button>
    </div>
  );
};
