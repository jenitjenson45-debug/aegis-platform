import React from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "../../types/aegis";
import { Shield, User, Mic } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAegis = message.sender === "aegis";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex items-start space-x-3 ${isAegis ? "justify-start" : "justify-end flex-row-reverse space-x-reverse"}`}
    >
      {/* Avatar Badge */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
          isAegis
            ? "bg-[#2563FF]/20 border-blue-500/40 text-[#2563FF] shadow-[0_0_12px_rgba(37,99,255,0.3)]"
            : "bg-[#C1123F]/20 border-red-500/40 text-[#C1123F]"
        }`}
      >
        {isAegis ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Content Bubble */}
      <div
        className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md border ${
          isAegis
            ? "bg-[#111820]/80 text-[#F5F7FA] border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
            : "bg-gradient-to-r from-blue-950/60 to-red-950/60 text-white border-blue-500/30"
        }`}
      >
        <div className="flex items-center justify-between space-x-4 mb-1">
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#8A99AD]">
            {isAegis ? "AEGIS" : "GUARDIAN VISITOR"}
          </span>
          <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#8A99AD]/60">
            {message.isVoice && <Mic className="w-2.5 h-2.5 text-cyan-400" />}
            <span>{message.timestamp}</span>
          </div>
        </div>

        <p className="whitespace-pre-line font-sans text-sm md:text-[15px] font-normal text-slate-100">
          {message.text}
        </p>
      </div>
    </motion.div>
  );
};
