"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, Scan } from "lucide-react";

const ingredientResults = [
  {
    name: "Sodium Benzoate (E211)",
    category: "Preservative",
    level: "moderate",
    icon: AlertCircle,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    text: "May react with vitamin C to form benzene in acidic beverages.",
  },
  {
    name: "Citric Acid (E330)",
    category: "Acidulant",
    level: "low",
    icon: CheckCircle2,
    color: "text-green-700 bg-green-50 border-green-200",
    text: "Naturally occurring organic acid. Generally considered safe.",
  },
  {
    name: "Aspartame (E951)",
    category: "Sweetener",
    level: "moderate",
    icon: Info,
    color: "text-blue-700 bg-blue-50 border-blue-200",
    text: "FDA approved. Avoid if you have phenylketonuria (PKU).",
  },
  {
    name: "Carrageenan (E407)",
    category: "Stabilizer",
    level: "moderate",
    icon: AlertCircle,
    color: "text-orange-700 bg-orange-50 border-orange-200",
    text: "Derived from red seaweed. Some studies suggest gut sensitivity.",
  },
];

const healthScores = [
  { label: "Processing Level", value: 58, color: "#f59e0b" },
  { label: "Additive Score", value: 62, color: "#f97316" },
  { label: "Nutritional Value", value: 71, color: "#22c55e" },
];

export function ScannerMockup() {
  const [stage, setStage] = useState<"scanning" | "results">("scanning");
  const [visibleCount, setVisibleCount] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Animate scan progress
    const progressInterval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setStage("results"), 300);
          return 100;
        }
        return p + 4;
      });
    }, 60);
    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (stage !== "results") return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= ingredientResults.length) clearInterval(timer);
    }, 400);
    return () => clearInterval(timer);
  }, [stage]);

  // Reset loop
  useEffect(() => {
    const reset = setTimeout(() => {
      setStage("scanning");
      setVisibleCount(0);
      setScanProgress(0);
    }, 12000);
    return () => clearTimeout(reset);
  }, [stage]);

  return (
    <div className="relative mx-auto max-w-sm lg:max-w-none">
      {/* Phone frame */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-gray-200/80 overflow-hidden"
           style={{ aspectRatio: "9/16", maxHeight: "640px" }}>

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-white/90 backdrop-blur flex items-center justify-between px-6 z-10">
          <span className="text-xs font-semibold text-gray-800">9:41</span>
          <div className="w-20 h-5 bg-black rounded-full" />
          <div className="flex items-center gap-1">
            <div className="w-3 h-2 border border-gray-800 rounded-sm">
              <div className="w-2 h-1 bg-gray-800 rounded-sm m-px" />
            </div>
          </div>
        </div>

        {/* App header */}
        <div className="absolute top-12 left-0 right-0 bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-2 z-10">
          <div className="w-6 h-6 bg-gradient-to-br from-green-900 to-emerald rounded-lg flex items-center justify-center">
            <Scan className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-sm text-navy-900">NutriScan AI</span>
        </div>

        {/* Content */}
        <div className="absolute top-24 inset-x-0 bottom-0 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {stage === "scanning" ? (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-6 pb-12"
              >
                {/* Scan area */}
                <div className="relative w-48 h-48 rounded-2xl border-2 border-dashed border-green-300 bg-green-50 flex items-center justify-center overflow-hidden">
                  {/* Scanning line */}
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald to-transparent"
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{ position: "absolute" }}
                  />
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <Scan className="w-6 h-6 text-green-700" />
                    </div>
                    <p className="text-xs text-green-700 font-medium">Analyzing ingredients...</p>
                  </div>
                  {/* Corner brackets */}
                  {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
                    <div key={pos} className={`absolute w-4 h-4 border-green-500 border-2 ${
                      pos.includes("top") ? "top-2" : "bottom-2"
                    } ${
                      pos.includes("left") ? "left-2 border-r-0 border-b-0" : "right-2 border-l-0 border-b-0"
                    } ${pos.includes("bottom") && pos.includes("left") ? "border-r-0 border-t-0" : ""}
                    ${pos.includes("bottom") && pos.includes("right") ? "border-l-0 border-t-0" : ""}
                    `} />
                  ))}
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Extracting ingredients</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-900 to-emerald rounded-full"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    AI analyzing 12 ingredients...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 pb-8"
              >
                {/* Overall score */}
                <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-green-300 text-xs font-medium">Overall Score</p>
                      <p className="text-white font-bold text-sm mt-0.5">Mystery Soda 500ml</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black">C</div>
                      <div className="text-green-300 text-xs">64/100</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {healthScores.map(({ label, value, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-green-200 mb-0.5">
                          <span>{label}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{ background: color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingredient cards */}
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                  Ingredients Analyzed
                </p>
                {ingredientResults.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <AnimatePresence key={item.name}>
                      {visibleCount > i && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-3 p-3 rounded-xl border ${item.color}`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold leading-tight">{item.name}</p>
                            <p className="text-xs opacity-70 mt-0.5">{item.category}</p>
                            <p className="text-xs opacity-80 mt-1 leading-relaxed">{item.text}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute -left-8 top-1/4 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800">FDA Approved</p>
          <p className="text-xs text-gray-500">12 checked</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [4, -4, 4] }}
        transition={{ repeat: Infinity, duration: 3.5 }}
        className="absolute -right-8 bottom-1/3 bg-white rounded-xl shadow-lg border border-gray-100 p-3"
      >
        <p className="text-xs font-bold text-gray-800">2,000+</p>
        <p className="text-xs text-gray-500">Ingredients in DB</p>
      </motion.div>
    </div>
  );
}
