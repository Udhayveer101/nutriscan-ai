"use client";

import { motion } from "framer-motion";

interface Props {
  label: string;
  value: number;
  description?: string;
  delay?: number;
}

function getColor(value: number): string {
  if (value >= 80) return "#22c55e";
  if (value >= 65) return "#84cc16";
  if (value >= 50) return "#f59e0b";
  if (value >= 35) return "#f97316";
  return "#ef4444";
}

export function ScoreGauge({ label, value, description, delay = 0 }: Props) {
  const color = getColor(value);
  const circumference = 2 * Math.PI * 36;
  const strokeDash = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center gap-2">
      {/* Circular gauge */}
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
          {/* Track */}
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="7"
          />
          {/* Progress */}
          <motion.circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 1, delay, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-xl font-black"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
          >
            {value}
          </motion.span>
          <span className="text-[9px] text-gray-400 font-medium">/100</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-800">{label}</p>
        {description && <p className="text-[10px] text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
