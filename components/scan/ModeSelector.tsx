"use client";

import { AnalysisMode } from "./ScannerInterface";

const MODES: { id: AnalysisMode; emoji: string; label: string; desc: string }[] = [
  { id: "BEGINNER",   emoji: "👤", label: "Simple",     desc: "Plain language" },
  { id: "PARENT",     emoji: "👨‍👩‍👧", label: "Parent",     desc: "Kid safety" },
  { id: "ATHLETE",    emoji: "🏃", label: "Athlete",    desc: "Performance" },
  { id: "SCIENTIFIC", emoji: "🔬", label: "Scientific", desc: "Detailed" },
];

interface Props {
  mode: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
}

export function ModeSelector({ mode, onChange }: Props) {
  return (
    <div className="ios-card p-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--ios-label2)" }}>
        Analysis Mode
      </p>
      <div className="grid grid-cols-4 gap-2">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className="flex flex-col items-center gap-1 py-3 px-1 rounded-2xl transition-all duration-150 active:scale-95 select-none"
              style={{
                background: active ? "rgba(26,92,42,0.08)" : "var(--ios-surface2)",
                border: active ? "1.5px solid rgba(26,92,42,0.25)" : "1.5px solid transparent",
              }}
            >
              <span className="text-xl leading-none">{m.emoji}</span>
              <span
                className="text-[12px] font-semibold mt-0.5"
                style={{ color: active ? "var(--ios-tint)" : "var(--ios-label)" }}
              >
                {m.label}
              </span>
              <span className="text-[10px] hidden sm:block" style={{ color: "var(--ios-label2)" }}>
                {m.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
