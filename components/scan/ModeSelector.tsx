"use client";

import { Leaf, Baby, Dumbbell, FlaskConical } from "lucide-react";
import { AnalysisMode } from "./ScannerInterface";

const MODES: { id: AnalysisMode; icon: typeof Leaf; label: string; desc: string }[] = [
  { id: "BEGINNER", icon: Leaf, label: "Simple", desc: "Plain language" },
  { id: "PARENT", icon: Baby, label: "Parent", desc: "Kid safety" },
  { id: "ATHLETE", icon: Dumbbell, label: "Athlete", desc: "Performance" },
  { id: "SCIENTIFIC", icon: FlaskConical, label: "Scientific", desc: "Full detail" },
];

interface Props {
  mode: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
}

export function ModeSelector({ mode, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3.5">
        <div className="font-mono-label font-bold text-[11px] tracking-[.14em]" style={{ color: "var(--muted-2)" }}>ANALYSIS MODE</div>
        <div className="font-mono-label text-[11px]" style={{ color: "var(--muted-4)" }}>how we explain it to you</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className="rounded-2xl py-4 px-3 text-center transition-all"
              style={active
                ? { background: "linear-gradient(150deg,#dcfce7,#bbf7d0)", border: "1.5px solid var(--brand-600)", boxShadow: "0 8px 20px -8px rgba(22,163,74,.4)" }
                : { background: "rgba(255,255,255,.55)", border: "1.5px solid rgba(20,70,45,.1)" }}
            >
              <div className="w-[34px] h-[34px] mx-auto rounded-[10px] flex items-center justify-center" style={{ background: active ? "#fff" : "#f0f4f1", color: active ? "var(--brand-800)" : "var(--ink-3)" }}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="mt-2 font-heading font-bold text-[14px]" style={{ color: active ? "#0f4a2a" : "var(--ink-3)" }}>{m.label}</div>
              <div className="mt-0.5 text-[10.5px]" style={{ color: active ? "#3d7154" : "var(--muted-2)" }}>{m.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
