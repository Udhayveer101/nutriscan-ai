"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, FileText, Barcode, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { UploadTab } from "./UploadTab";
import { PasteTab } from "./PasteTab";
import { BarcodeTab } from "./BarcodeTab";
import { ModeSelector } from "./ModeSelector";

export type ScanTab = "upload" | "camera" | "paste" | "barcode";
export type AnalysisMode = "BEGINNER" | "PARENT" | "ATHLETE" | "SCIENTIFIC";

const TABS: { id: ScanTab; label: string; icon: typeof Upload; description: string }[] = [
  { id: "upload", label: "Upload Image", icon: Upload, description: "Photo of ingredient list" },
  { id: "camera", label: "Use Camera", icon: Camera, description: "Scan with device camera" },
  { id: "paste", label: "Paste Text", icon: FileText, description: "Copy ingredient list" },
  { id: "barcode", label: "Barcode", icon: Barcode, description: "Scan product barcode" },
];

export function ScannerInterface() {
  const [activeTab, setActiveTab] = useState<ScanTab>("upload");
  const [mode, setMode] = useState<AnalysisMode>("BEGINNER");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = useCallback(
    async (data: { method: string; text?: string; barcode?: string }) => {
      setIsAnalyzing(true);
      setError(null);

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
    <div className="space-y-6">
      {/* Mode selector */}
      <ModeSelector mode={mode} onChange={setMode} />

      {/* Main card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-4 px-2 text-xs font-medium transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? "text-green-900 bg-green-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:block">{tab.label}</span>
                <span className="sm:hidden text-[10px]">{tab.label.split(" ")[0]}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-900"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "upload" && (
                <UploadTab onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
              )}
              {activeTab === "camera" && (
                <div className="text-center py-16 text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">Camera Mode</p>
                  <p className="text-sm mt-1">Use your device camera to scan ingredient lists</p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="mt-4 text-green-700 text-sm font-medium hover:underline"
                  >
                    Use file upload instead →
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex flex-col items-center gap-3 py-8"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-green-100 border-t-green-900 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg">🌿</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800">Analyzing ingredients...</p>
                  <p className="text-sm text-gray-500 mt-1">AI is processing your product</p>
                </div>
                <div className="flex items-center gap-2">
                  {["Extracting", "Looking up DB", "AI analysis", "Scoring"].map((step, i) => (
                    <div key={step} className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 text-green-700 animate-spin" style={{ animationDelay: `${i * 200}ms` }} />
                      <span className="text-xs text-gray-500">{step}</span>
                      {i < 3 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400 max-w-xl mx-auto">
        NutriScan AI provides educational information only. Not a substitute for
        professional dietary or medical advice. Evidence-based, not diagnostic.
      </p>
    </div>
  );
}
