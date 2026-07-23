"use client";

import Link from "next/link";
import { ArrowLeft, Share2, Bookmark, CheckCircle2, AlertCircle, Info, ExternalLink, Skull, ShieldAlert } from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { Reveal } from "@/components/ui/Reveal";
import { GradeBadge } from "@/components/ui/GradeBadge";
import type { Grade } from "@/lib/grade";

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

const CONCERN_CONFIG: Record<string, { icon: typeof CheckCircle2; label: string; text: string; bg: string; border: string }> = {
  LOW: { icon: CheckCircle2, label: "Low concern", text: "#15803d", bg: "#dcfce7", border: "#a7e3ba" },
  MEDIUM: { icon: Info, label: "Moderate concern", text: "#b45309", bg: "#fef3c7", border: "#fcd88a" },
  HIGH: { icon: AlertCircle, label: "High concern", text: "#dc2626", bg: "#fee2e2", border: "#f7b4b4" },
  CRITICAL: { icon: Skull, label: "AVOID — serious risk", text: "#fff", bg: "#1c1917", border: "#1c1917" },
};

// Highest risk first. Within LOW, natural/whole-food ingredients (beneficial) sort
// ahead of unrecognised-but-harmless ones (neutral) — mirrors the 6-tier risk order.
const CONCERN_RANK: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
function riskSortKey(ing: ScanIngredient): number {
  const rank = CONCERN_RANK[ing.concernLevel] ?? 3;
  if (rank !== 3) return rank * 10;
  return ing.ingredient ? 30 : 31; // beneficial (recognized/natural) before neutral
}

export function ResultsView({ scan }: { scan: Scan }) {
  const breakdown = scan.scoreBreakdown;
  const sortedIngredients = [...scan.ingredients].sort((a, b) => riskSortKey(a) - riskSortKey(b));

  const gaugeData = [
    { label: "Processing Level", value: breakdown.processing as number, description: "How processed is this product" },
    { label: "Additive Score", value: breakdown.additiveDensity as number, description: "Density of artificial additives" },
    { label: "Nutritional Value", value: (breakdown.ingredientQuality ?? breakdown.nutritionalValue) as number, description: "Overall nutritional quality" },
    { label: "Sugar Content", value: breakdown.sugarContent as number, description: "Sugar level evaluation" },
    { label: "Sodium Content", value: breakdown.sodiumContent as number, description: "Sodium level evaluation" },
  ];

  return (
    <div className="space-y-5">
      {/* Back navigation */}
      <Link
        href="/scan"
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: "var(--muted-2)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Scan another product
      </Link>

      {/* Hero verdict card */}
      <Reveal className="glass rounded-3xl p-7 md:p-8">
        <div
          className="inline-flex items-center gap-2 font-mono-label font-semibold text-[11px] tracking-[.1em] px-3 py-1.5 rounded-full"
          style={{ color: "var(--brand-800)", background: "rgba(22,101,52,.09)", border: "1px solid rgba(22,101,52,.16)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand-600)" }} /> ANALYSIS COMPLETE
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between mt-4">
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl md:text-[32px] font-extrabold leading-tight" style={{ color: "var(--ink)" }}>
              {scan.productName ?? "Scanned Product"}
            </h1>
            {scan.brand && <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{scan.brand}</p>}
            <div className="flex items-center gap-2.5 mt-3 text-sm" style={{ color: "var(--muted-2)" }}>
              <span>{scan.ingredients.length} ingredients analyzed</span>
              <span className="w-1 h-1 rounded-full" style={{ background: "var(--muted-4)" }} />
              <span>{scan.ingredients.filter((i) => i.isRecognized).length} in our database</span>
            </div>
          </div>

          <div className="text-center flex-shrink-0">
            <GradeBadge grade={scan.grade as Grade} size="lg" className="mx-auto" />
            <p className="text-sm mt-2 font-mono-label" style={{ color: "var(--muted-2)" }}>{scan.overallScore}/100</p>
          </div>
        </div>

        <div className="flex gap-2.5 mt-6">
          <button className="glass flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-transform hover:-translate-y-0.5" style={{ color: "var(--ink-3)" }}>
            <Bookmark className="w-4 h-4" /> Save
          </button>
          <button className="glass flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-transform hover:-translate-y-0.5" style={{ color: "var(--ink-3)" }}>
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        <div className="h-px my-6" style={{ background: "var(--separator)" }} />

        {/* Score breakdown */}
        <h2 className="font-heading font-bold text-lg mb-5" style={{ color: "var(--ink)" }}>Score Breakdown</h2>
        <div
          className="inline-block w-full font-mono-label text-[10.5px]"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.75rem" }}
        >
          {gaugeData.map((g, i) => (
            <ScoreGauge key={g.label} label={g.label} value={g.value} description={g.description} delay={i * 0.08} />
          ))}
        </div>
      </Reveal>

      {/* Allergen Warning */}
      {scan.allergens && scan.allergens.length > 0 && (
        <Reveal delay={0.05} className="rounded-3xl p-6" style={{ background: "#fef2f2", border: "2px solid #fecaca" }}>
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" style={{ color: "#dc2626" }} />
            <h2 className="font-heading font-bold" style={{ color: "#991b1b" }}>Allergen Alert</h2>
            <span className="font-mono-label text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#fecaca", color: "#991b1b" }}>
              {scan.allergens.length} detected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {scan.allergens.map((a) => (
              <div key={a.allergen} className="flex items-center gap-2 px-3 py-2 bg-white border rounded-xl" style={{ borderColor: "#fecaca" }}>
                <span className="text-sm font-bold" style={{ color: "#991b1b" }}>{a.allergen}</span>
                <span className="text-xs" style={{ color: "#dc9d9d" }}>via {a.matchedIngredient}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs" style={{ color: "#b91c1c" }}>
            If you have allergies or intolerances to any of the above, do not consume this product.
          </p>
        </Reveal>
      )}

      {/* Ingredients */}
      <Reveal delay={0.1} className="glass rounded-3xl p-6 md:p-7">
        <h2 className="font-heading font-bold text-lg mb-5" style={{ color: "var(--ink)" }}>
          Ingredient Breakdown
          <span className="ml-2 text-sm font-normal font-sans" style={{ color: "var(--muted-3)" }}>
            ({scan.ingredients.length} found)
          </span>
        </h2>
        <div className="space-y-2.5">
          {sortedIngredients.map((ing, i) => {
            const concern = CONCERN_CONFIG[ing.concernLevel] ?? CONCERN_CONFIG.LOW;
            const Icon = concern.icon;

            return (
              <Reveal key={ing.id} delay={0.03 * i} y={12} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,.6)", border: "1px solid rgba(20,70,45,.08)" }}>
                <div className="flex gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: concern.text === "#fff" ? "#1c1917" : concern.text }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                      <div>
                        <span className="font-heading font-bold text-[14.5px]" style={{ color: "var(--ink-2)" }}>
                          {ing.ingredient?.name ?? ing.normalizedName ?? ing.rawName}
                        </span>
                        {ing.ingredient?.eNumber && (
                          <span className="ml-2 font-mono-label text-[10.5px]" style={{ color: "var(--muted-3)" }}>
                            {ing.ingredient.eNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="font-mono-label text-[9.5px] font-bold px-2 py-0.5 rounded-full" style={{ background: concern.bg, color: concern.text, border: `1px solid ${concern.border}` }}>
                          {concern.label.toUpperCase()}
                        </span>
                        {ing.ingredient?.category && (
                          <span className="font-mono-label text-[9.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(20,70,45,.06)", color: "var(--muted-2)" }}>
                            {ing.ingredient.category.name}
                          </span>
                        )}
                        {ing.ingredient && (
                          <Link href={`/ingredients/${ing.ingredient.slug}`} className="opacity-50 hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-3.5 h-3.5" style={{ color: "var(--muted-2)" }} />
                          </Link>
                        )}
                      </div>
                    </div>
                    {ing.concernLevel === "CRITICAL" && (
                      <div className="mb-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide" style={{ background: "#1c1917", color: "#fff" }}>
                        ⚠ Banned in multiple countries · Linked to cancer or serious illness at normal consumption
                      </div>
                    )}
                    {ing.triggersUserAllergen && (
                      <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide text-white" style={{ background: "#dc2626" }}>
                        ⬡ YOUR ALLERGEN — Do not consume
                      </div>
                    )}
                    {ing.triggersUserAvoid && !ing.triggersUserAllergen && (
                      <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide text-white" style={{ background: "var(--brand-800)" }}>
                        ◈ On your avoid list
                      </div>
                    )}
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>{ing.aiExplanation}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Reveal>

      {/* Legal disclaimer */}
      <div className="p-4 rounded-2xl" style={{ background: "rgba(20,70,45,.05)" }}>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted-2)" }}>
          <strong style={{ color: "var(--ink-3)" }}>Educational Information Only:</strong> This analysis is for informational purposes
          and should not be used as a substitute for professional dietary or medical advice. Ingredient
          safety can vary based on individual health conditions, allergies, and consumption amounts.
          Always consult a healthcare professional for personalized guidance.
        </p>
      </div>
    </div>
  );
}
