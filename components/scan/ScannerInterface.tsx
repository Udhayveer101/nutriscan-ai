"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Barcode, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { UploadTab } from "./UploadTab";
import { PasteTab } from "./PasteTab";
import { BarcodeTab } from "./BarcodeTab";
import { ModeSelector } from "./ModeSelector";

export type ScanTab = "upload" | "paste" | "barcode";
export type AnalysisMode = "BEGINNER" | "PARENT" | "ATHLETE" | "SCIENTIFIC";

const TABS: { id: ScanTab; label: string; icon: typeof Upload; short: string }[] = [
  { id: "upload",  label: "Upload Photo", icon: Upload,   short: "Photo" },
  { id: "paste",   label: "Paste Text",   icon: FileText, short: "Text" },
  { id: "barcode", label: "Barcode",      icon: Barcode,  short: "Barcode" },
];

export function ScannerInterface() {
  const [activeTab, setActiveTab] = useState<ScanTab>("upload");
  const [mode, setMode] = useState<AnalysisMode>("BEGINNER");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = useCallback(
    async (data: { method: string; text?: string; ingredients?: string[]; barcode?: string }) => {
      // Flush state synchronously before starting the network request so the
      // loading UI appears on the very next paint, not after the fetch begins.
      setError(null);
      setIsAnalyzing(true);

      // Yield to the browser for one frame so React can paint the loading state
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      try {
        const res = await fetch("/api/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, mode }),
        });

        const json = await res.json();

        if (!res.ok) {
          setError(json.error ?? "Analysis failed. Please try again.");
          return;
        }

        router.push(`/scan/results/${json.scanId}`);
      } catch {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setIsAnalyzing(false);
      }
    },
    [mode, router]
  );

  return (
    <div className="glass rounded-[22px] p-5 md:p-[26px]">
      <ModeSelector mode={mode} onChange={setMode} />

      {/* Input method */}
      <div className="font-mono-label font-bold text-[11px] tracking-[.14em] mt-6 mb-3.5" style={{ color: "var(--muted-2)" }}>INPUT METHOD</div>
      <div className="flex gap-1.5 p-[5px] rounded-[13px] mb-5" style={{ background: "rgba(20,70,45,.06)" }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[9px] font-semibold text-[13.5px] transition-all"
              style={active
                ? { background: "#fff", boxShadow: "0 4px 12px -4px rgba(20,50,30,.2)", color: "#0f4a2a" }
                : { color: "var(--muted)" }}
            >
              <Icon className="w-[15px] h-[15px] flex-shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.short}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {activeTab === "upload" && <UploadTab onAnalyze={handleAnalyze} isLoading={isAnalyzing} />}
          {activeTab === "paste" && <PasteTab onAnalyze={handleAnalyze} isLoading={isAnalyzing} />}
          {activeTab === "barcode" && <BarcodeTab onAnalyze={handleAnalyze} isLoading={isAnalyzing} />}
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-start gap-3 p-4 rounded-2xl text-[14px]"
            style={{ background: "rgba(220,38,38,.08)", color: "#c0392b" }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="mt-6 flex flex-col items-center gap-4 py-10"
          >
            <div className="relative">
              <div className="w-[60px] h-[60px] rounded-full border-[3px] animate-spin" style={{ borderColor: "rgba(20,70,45,.1)", borderTopColor: "var(--brand-700)" }} />
              <div className="absolute inset-0 flex items-center justify-center text-xl">🌿</div>
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-[16px]" style={{ color: "var(--ink-2)" }}>Analysing ingredients…</p>
              <p className="text-[13px] mt-1" style={{ color: "var(--muted-2)" }}>AI is reviewing your product</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {["Extracting", "Database", "AI review", "Scoring"].map((step) => (
                <span key={step} className="font-mono-label px-2.5 py-1 rounded-full text-[10.5px] font-medium" style={{ background: "rgba(20,70,45,.06)", color: "var(--muted-2)" }}>
                  {step}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <p className="text-center text-[11px] leading-relaxed max-w-sm mx-auto mt-5" style={{ color: "var(--muted-4)" }}>
        NutriScan AI is for educational purposes only. Not a substitute for professional dietary advice.
      </p>
    </div>
  );
}
