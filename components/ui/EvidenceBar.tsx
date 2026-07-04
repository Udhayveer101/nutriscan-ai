"use client";

import { motion } from "framer-motion";

interface Props {
  value: number;
  from?: string;
  to?: string;
  height?: number;
  trackColor?: string;
  delay?: number;
}

/** Animated horizontal fill bar — the mockups' `.ebar`/`.sbar` pattern. */
export function EvidenceBar({ value, from = "#4ade80", to = "#16a34a", height = 6, trackColor = "rgba(20,70,45,.1)", delay = 0 }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className="rounded-full overflow-hidden"
      style={{ height, background: trackColor }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay, ease: [0.2, 0.7, 0.2, 1] }}
      />
    </div>
  );
}
