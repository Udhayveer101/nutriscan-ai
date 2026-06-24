"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, FileText, Barcode, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { UploadTab } from "./UploadTab";
import { PasteTab } from "./PasteTab";
import { BarcodeTab } from "./BarcodeTab";
import { ModeSelector } from "./ModeSelector";

export type ScanTab = "upload" | "camera" | "paste" | "barcode";
export type AnalysisMode = "BEGINNER" | "PARENT" | "ATHLETE" | "SCIENTIFIC";

const TABS: { id: ScanTab; label: string; icon: typeof Upload; short: string }[] = [
  { id: "upload",  label: "Upload Photo", icon: Upload,   short: "Photo" },
  { id: "camera",  label: "Camera",       icon: Camera,   short: "Camera" },
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
    async (data: { method: string; text?: string; barcode?: string }) => {
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
    <div className="space-y-4">
      {/* Mode selector */}
      <ModeSelector mode={mode} onChange={setMode} />

      {/* iOS segmented control */}
      <div className="ios-card p-3">
        <div className="ios-segment-bar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`ios-segment ${active ? "active" : ""}`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content card */}
      <div className="ios-card overflow-hidden">
        <div className="p-5 md:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {activeTab === "upload" && (
                <UploadTab onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
              )}
              {activeTab === "camera" && (
                <div className="text-center py-14">
                  <div className="w-20 h-20 rounded-[22px] bg-gray-100 flex items-center justify-center mx-auto mb-5">
                    <Camera className="w-9 h-9 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <p className="font-semibold text-gray-900 text-[17px]">Camera Scan</p>
                  <p className="text-[14px] text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Point your camera at any ingredient list. Works best with good lighting.
                  </p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="mt-5 btn-secondary text-[14px] mx-auto"
                  >
                    Upload a photo instead
                  </button>
                </div>
              )}
              {activeTab === "paste" && (
                <PasteTab onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
              )}
              {activeTab === "barcode" && (
                <BarcodeTab onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
              )}
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
                style={{ background: "rgba(255,59,48,0.08)", color: "#c0392b" }}
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
                  <div className="w-[60px] h-[60px] rounded-full border-[3px] border-gray-100 border-t-green-700 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-xl">🌿</div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 text-[16px]">Analysing ingredients…</p>
                  <p className="text-[13px] mt-1" style={{ color: "var(--ios-label2)" }}>
                    AI is reviewing your product
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {["Extracting", "Database", "AI review", "Scoring"].map((step, i) => (
                    <span
                      key={step}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500"
                    >
                      <Loader2 className="w-3 h-3 animate-spin" style={{ animationDelay: `${i * 150}ms` }} />
                      {step}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[11px] leading-relaxed max-w-sm mx-auto px-4" style={{ color: "var(--ios-label3)" }}>
        NutriScan AI is for educational purposes only. Not a substitute for professional dietary advice.
      </p>
    </div>
  );
}
