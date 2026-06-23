"use client";

import { AnalysisMode } from "./ScannerInterface";

const MODES: { id: AnalysisMode; label: string; emoji: string; desc: string }[] = [
  { id: "BEGINNER", label: "Simple", emoji: "👤", desc: "Plain language" },
  { id: "PARENT", label: "Parent", emoji: "👨‍👩‍👧", desc: "Family focus" },
  { id: "ATHLETE", label: "Athlete", emoji: "🏃", desc: "Performance" },
  { id: "SCIENTIFIC", label: "Scientific", emoji: "🔬", desc: "Technical" },
];

interface Props {
  mode: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
}

export function ModeSelector({ mode, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Explanation Mode
      </p>
      <div className="grid grid-cols-4 gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all duration-200 ${
              mode === m.id
                ? "border-green-900 bg-green-50"
                : "border-transparent bg-gray-50 hover:border-gray-200"
            }`}
          >
            <span className="text-xl">{m.emoji}</span>
            <span className={`text-xs font-bold ${mode === m.id ? "text-green-900" : "text-gray-700"}`}>
              {m.label}
            </span>
            <span className="text-[10px] text-gray-400 hidden sm:block">{m.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
