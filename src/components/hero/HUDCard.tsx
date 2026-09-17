import React from "react";
import { motion } from "framer-motion";

interface HUDCardProps {
  label: string;
  value: string;
  subtext: string;
  icon?: React.ReactNode;
  accent?: "blue" | "red" | "white";
  className?: string;
}

export const HUDCard: React.FC<HUDCardProps> = ({
  label,
  value,
  subtext,
  icon,
  accent = "blue",
  className = "",
}) => {
  const accentColor =
    accent === "red"
      ? "text-[#C1123F] border-[#C1123F]/30"
      : accent === "white"
      ? "text-[#F5F7FA] border-white/20"
      : "text-[#2563FF] border-blue-500/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`glass-panel p-4 rounded-xl border ${accentColor} shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono tracking-widest text-[#8A99AD] uppercase font-bold">
          {label}
        </span>
        {icon && <div className="text-white/70">{icon}</div>}
      </div>
      <div className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white mb-0.5">
        {value}
      </div>
      <div className="text-[10px] font-mono text-[#8A99AD] tracking-wider">
        {subtext}
      </div>
    </motion.div>
  );
};
