"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Share2, Bookmark, CheckCircle2, AlertCircle, Info, ExternalLink, Skull, ShieldAlert } from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { gradeToLabel } from "@/lib/scoring";

interface ScanIngredient {
  id: string;
  rawName: string;
  normalizedName: string | null;
  position: number;
  aiExplanation: string;
  concernLevel: string;
  isRecognized: boolean;
  triggersUserAllergen?: boolean;
  triggersUserAvoid?: boolean;
  ingredient: {
    id: string;
    slug: string;
    name: string;
    eNumber: string | null;
    safetyScore: number;
    category: { name: string; color: string };
  } | null;
}

interface AllergenMatch {
  allergen: string;
  matchedIngredient: string;
}

interface Scan {
  id: string;
  productName: string | null;
  brand: string | null;
  overallScore: number;
  grade: string;
  scoreBreakdown: Record<string, number | string>;
  ingredients: ScanIngredient[];
  allergens?: AllergenMatch[];
  method: string;
  createdAt: Date;
}

const CONCERN_CONFIG = {
  LOW: { icon: CheckCircle2, color: "text-green-700 bg-green-50 border-green-200", label: "Low concern", badge: "bg-green-100 text-green-800" },
  MEDIUM: { icon: Info, color: "text-amber-700 bg-amber-50 border-amber-200", label: "Moderate concern", badge: "bg-amber-100 text-amber-800" },
  HIGH: { icon: AlertCircle, color: "text-red-700 bg-red-50 border-red-200", label: "High concern", badge: "bg-red-100 text-red-800" },
  CRITICAL: { icon: Skull, color: "text-white bg-gray-950 border-gray-800", label: "AVOID — serious health risk", badge: "bg-gray-900 text-white" },
};

const GRADE_COLORS: Record<string, string> = {
  A_PLUS: "text-green-600 bg-green-50 border-green-300",
  A: "text-green-700 bg-green-50 border-green-300",
  B: "text-lime-700 bg-lime-50 border-lime-300",
  C: "text-amber-700 bg-amber-50 border-amber-300",
  D: "text-orange-700 bg-orange-50 border-orange-300",
  F: "text-red-700 bg-red-50 border-red-300",
};

export function ResultsView({ scan }: { scan: Scan }) {
  const breakdown = scan.scoreBreakdown;
  const gradeLabel = gradeToLabel(scan.grade as Parameters<typeof gradeToLabel>[0]);

  const gaugeData = [
    { label: "Processing Level", value: breakdown.processing as number, description: "How processed is this product" },
    { label: "Additive Score", value: breakdown.additiveDensity as number, description: "Density of artificial additives" },
    { label: "Nutritional Value", value: (breakdown.ingredientQuality ?? breakdown.nutritionalValue) as number, description: "Overall nutritional quality" },
    { label: "Sugar Content", value: breakdown.sugarContent as number, description: "Sugar level evaluation" },
    { label: "Sodium Content", value: breakdown.sodiumContent as number, description: "Sodium level evaluation" },
  ];

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link
        href="/scan"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Scan another product
      </Link>

      {/* Hero score card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-navy-900 to-green-950 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex-1">
            <p className="text-green-300 text-sm font-medium mb-1">Product Analysis</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              {scan.productName ?? "Scanned Product"}
            </h1>
            {scan.brand && <p className="text-gray-400 text-sm">{scan.brand}</p>}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm text-gray-400">
                {scan.ingredients.length} ingredients analyzed
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span className="text-sm text-gray-400">
                {scan.ingredients.filter((i) => i.isRecognized).length} in our database
              </span>
            </div>
          </div>

          {/* Grade */}
          <div className="text-center flex-shrink-0">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl border-4 ${GRADE_COLORS[scan.grade]} bg-white`}>
              <span className="text-5xl font-black">{gradeLabel}</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">{scan.overallScore}/100</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="relative flex gap-3 mt-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
            <Bookmark className="w-4 h-4" />
            Save
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </motion.div>

      {/* Score gauges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
      >
        <h2 className="font-bold text-gray-900 mb-6">Score Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gaugeData.map((g, i) => (
            <ScoreGauge
              key={g.label}
              label={g.label}
              value={g.value}
              description={g.description}
              delay={i * 0.1}
            />
          ))}
        </div>
      </motion.div>

      {/* Allergen Warning */}
      {scan.allergens && scan.allergens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-purple-50 border-2 border-purple-300 rounded-3xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <h2 className="font-bold text-purple-900">Allergen Alert</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-200 text-purple-800">
              {scan.allergens.length} detected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {scan.allergens.map((a) => (
              <div
                key={a.allergen}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-purple-200 rounded-xl shadow-sm"
              >
                <span className="text-sm font-bold text-purple-800">{a.allergen}</span>
                <span className="text-xs text-purple-400">via {a.matchedIngredient}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-purple-700">
            If you have allergies or intolerances to any of the above, do not consume this product.
          </p>
        </motion.div>
      )}

      {/* Ingredients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
      >
        <h2 className="font-bold text-gray-900 mb-6">
          Ingredient Breakdown
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({scan.ingredients.length} found)
          </span>
        </h2>
        <div className="space-y-3">
          {scan.ingredients.map((ing, i) => {
            const concern = CONCERN_CONFIG[ing.concernLevel as keyof typeof CONCERN_CONFIG] ?? CONCERN_CONFIG.LOW;
            const Icon = concern.icon;

            return (
              <motion.div
                key={ing.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex gap-4 p-4 rounded-2xl border ${concern.color}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="font-semibold text-sm">
                        {ing.ingredient?.name ?? ing.normalizedName ?? ing.rawName}
                      </span>
                      {ing.ingredient?.eNumber && (
                        <span className="ml-2 text-xs font-mono opacity-60">
                          {ing.ingredient.eNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${concern.badge}`}>
                        {concern.label}
                      </span>
                      {ing.ingredient?.category && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 border border-current opacity-60">
                          {ing.ingredient.category.name}
                        </span>
                      )}
                      {ing.ingredient && (
                        <Link
                          href={`/ingredients/${ing.ingredient.slug}`}
                          className="opacity-50 hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                  {ing.concernLevel === "CRITICAL" && (
                    <div className="mb-2 px-3 py-1.5 bg-white/10 rounded-lg border border-white/20 text-xs font-bold uppercase tracking-wide">
                      ⚠ Banned in multiple countries · Linked to cancer or serious illness at normal consumption
                    </div>
                  )}
                  {ing.triggersUserAllergen && (
                    <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold tracking-wide">
                      ⬡ YOUR ALLERGEN — Do not consume
                    </div>
                  )}
                  {ing.triggersUserAvoid && !ing.triggersUserAllergen && (
                    <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold tracking-wide">
                      ◈ On your avoid list
                    </div>
                  )}
                  <p className="text-xs leading-relaxed opacity-80">{ing.aiExplanation}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Legal disclaimer */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong>Educational Information Only:</strong> This analysis is for informational purposes
          and should not be used as a substitute for professional dietary or medical advice. Ingredient
          safety can vary based on individual health conditions, allergies, and consumption amounts.
          Always consult a healthcare professional for personalized guidance.
        </p>
      </div>
    </div>
  );
}
