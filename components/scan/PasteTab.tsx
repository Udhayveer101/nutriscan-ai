"use client";

import { useState } from "react";
import { ArrowRight, ClipboardPaste } from "lucide-react";

interface Props {
  onAnalyze: (data: { method: string; text: string }) => void;
  isLoading: boolean;
}

const EXAMPLE = `Water, Sugar, Citric Acid (E330), Sodium Benzoate (E211), Potassium Sorbate (E202),
Aspartame (E951), Acesulfame Potassium (E950), Natural and Artificial Flavors,
Red 40 (E129), Phosphoric Acid (E338)`;

export function PasteTab({ onAnalyze, isLoading }: Props) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (text.trim().length < 10 || submitted) return;
    setSubmitted(true);
    onAnalyze({ method: "PASTE", text });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--ink-3)" }}>
          Paste ingredient list
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Example:\n${EXAMPLE}`}
          rows={6}
          className="w-full px-4 py-3.5 rounded-2xl text-sm resize-none focus:outline-none transition-all"
          style={{ background: "rgba(255,255,255,.6)", border: "1px solid rgba(20,70,45,.12)", color: "var(--ink-2)" }}
        />
        <div className="flex items-center justify-between mt-1.5 text-xs" style={{ color: "var(--muted-3)" }}>
          <p>Copy from packaging, websites, or apps</p>
          <span>{text.length} chars</span>
        </div>
      </div>

      <button
        onClick={() => setText(EXAMPLE)}
        className="flex items-center gap-2 text-xs font-semibold hover:underline"
        style={{ color: "var(--brand-700)" }}
      >
        <ClipboardPaste className="w-3.5 h-3.5" />
        Use example ingredients
      </button>

      <button
        onClick={handleSubmit}
        disabled={text.trim().length < 10 || isLoading || submitted}
        className="w-full btn-primary py-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitted || isLoading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analysing…</>
        ) : (
          <>Analyse Ingredients <ArrowRight className="w-4 h-4" /></>
        )}
      </button>
    </div>
  );
}
