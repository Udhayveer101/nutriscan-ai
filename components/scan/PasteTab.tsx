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

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Paste ingredient list
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Example:\n${EXAMPLE}`}
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-gray-400">
            Copy from packaging, websites, or apps
          </p>
          <span className="text-xs text-gray-400">{text.length} chars</span>
        </div>
      </div>

      <button
        onClick={() => setText(EXAMPLE)}
        className="flex items-center gap-2 text-xs text-green-700 font-medium hover:underline"
      >
        <ClipboardPaste className="w-3.5 h-3.5" />
        Use example ingredients
      </button>

      <button
        onClick={() => onAnalyze({ method: "PASTE", text })}
        disabled={text.trim().length < 10 || isLoading}
        className="w-full btn-primary py-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Analyze Ingredients
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
