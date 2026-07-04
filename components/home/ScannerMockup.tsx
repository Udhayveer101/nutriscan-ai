"use client";

import { motion } from "framer-motion";

const ROWS = [
  { name: "Sodium Benzoate", meta: "E211 · PRESERVATIVE", grade: "C", bg: "#fef3c7", text: "#b45309", border: "#fcd88a" },
  { name: "Ascorbic Acid", meta: "E300 · ANTIOXIDANT", grade: "A", bg: "#dcfce7", text: "#15803d", border: "#a7e3ba" },
  { name: "Red 40", meta: "E129 · COLORING", grade: "F", bg: "#fee2e2", text: "#dc2626", border: "#f7b4b4" },
];

export function ScannerMockup() {
  return (
    <div className="relative">
      <div className="glass relative rounded-[22px] p-[22px] overflow-hidden">
        <div className="flex items-center justify-between mb-3.5">
          <div className="font-mono-label font-semibold text-[11px] tracking-[.1em]" style={{ color: "var(--brand-800)" }}>◉ ANALYZING LABEL</div>
          <div className="font-mono-label font-semibold text-[11px]" style={{ color: "var(--muted-4)" }}>12 / 12</div>
        </div>

        <div className="ph h-[118px] rounded-xl mb-3.5">PRODUCT PACKAGING PHOTO</div>

        <div className="flex flex-col gap-2">
          {ROWS.map((row) => (
            <div key={row.name} className="flex items-center justify-between rounded-[10px] px-[11px] py-2.5" style={{ background: "rgba(255,255,255,.6)", border: "1px solid rgba(20,70,45,.08)" }}>
              <div>
                <div className="font-semibold text-[13px]" style={{ color: "var(--ink-2)" }}>{row.name}</div>
                <div className="font-mono-label text-[10px]" style={{ color: "var(--muted-3)" }}>{row.meta}</div>
              </div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-heading font-bold text-[13px]" style={{ background: row.bg, color: row.text, border: `1px solid ${row.border}` }}>
                {row.grade}
              </div>
            </div>
          ))}
        </div>

        {/* scanning beam */}
        <motion.div
          className="absolute left-0 right-0 h-[34%] pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent, rgba(74,222,128,.28), transparent)" }}
          animate={{ top: ["-32%", "112%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
        />
        {/* floating magnifier lens */}
        <motion.div
          className="absolute rounded-full"
          style={{
            right: 26, top: 148, width: 78, height: 78,
            background: "radial-gradient(circle at 34% 30%, rgba(255,255,255,.55), rgba(255,255,255,.12))",
            border: "2px solid rgba(255,255,255,.9)",
            boxShadow: "0 12px 30px rgba(15,60,35,.28), inset 0 0 18px rgba(255,255,255,.5)",
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* floating "verdict ready" chip */}
      <motion.div
        className="glass absolute left-[-22px] bottom-[-16px] rounded-[13px] px-3.5 py-2.5 flex items-center gap-2.5"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-[26px] h-[26px] rounded-lg flex items-center justify-center text-[14px]" style={{ background: "#dcfce7", color: "#15803d" }}>✓</div>
        <div>
          <div className="font-bold text-[12px]" style={{ color: "var(--ink-2)" }}>Verdict ready</div>
          <div className="font-mono-label text-[9.5px]" style={{ color: "var(--muted-4)" }}>EVIDENCE-CITED</div>
        </div>
      </motion.div>
    </div>
  );
}
