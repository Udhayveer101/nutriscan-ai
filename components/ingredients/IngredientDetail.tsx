"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Info, ExternalLink, Shield, FlaskConical } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { GradeBadge } from "@/components/ui/GradeBadge";

interface Reference {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string | null;
  findings: string;
}

interface Ingredient {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  eNumber: string | null;
  purpose: string;
  purposeShort: string;
  benefits: string;
  concerns: string;
  sciConsensus: string;
  evidenceLevel: string;
  fdaStatus: string;
  efsaStatus: string;
  fssaiStatus: string;
  whoStatus: string;
  safetyScore: number;
  commonProducts: string[];
  adiValue: string | null;
  isNatural: boolean;
  isVegan: boolean;
  updatedAt: Date;
  category: { name: string; icon: string; color: string };
  references: Reference[];
}

const EVIDENCE_CONFIG: Record<string, { label: string; text: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  STRONG: { label: "Strong Evidence", text: "#15803d", bg: "#dcfce7", border: "#a7e3ba", icon: CheckCircle2 },
  MODERATE: { label: "Moderate Evidence", text: "#1e40af", bg: "#dbeafe", border: "#bfdbfe", icon: Info },
  LIMITED: { label: "Limited Evidence", text: "#b45309", bg: "#fef3c7", border: "#fcd88a", icon: AlertCircle },
  INSUFFICIENT: { label: "Insufficient Evidence", text: "var(--muted-2)", bg: "rgba(20,70,45,.06)", border: "rgba(20,70,45,.12)", icon: Info },
};

export function IngredientDetail({ ingredient }: { ingredient: Ingredient }) {
  const evidenceConfig = EVIDENCE_CONFIG[ingredient.evidenceLevel] ?? EVIDENCE_CONFIG.MODERATE;
  const EvidenceIcon = evidenceConfig.icon;

  const regulatoryStatuses = [
    { org: "FDA", status: ingredient.fdaStatus, flag: "🇺🇸" },
    { org: "EFSA", status: ingredient.efsaStatus, flag: "🇪🇺" },
    { org: "FSSAI", status: ingredient.fssaiStatus, flag: "🇮🇳" },
    { org: "WHO", status: ingredient.whoStatus, flag: "🌍" },
  ];

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link href="/ingredients" className="inline-flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: "var(--muted-2)" }}>
        <ArrowLeft className="w-4 h-4" />
        Back to Ingredient Database
      </Link>

      {/* Hero */}
      <Reveal className="glass rounded-3xl p-7 md:p-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xl">{ingredient.category.icon}</span>
              <span className="font-mono-label text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(20,70,45,.06)", color: "var(--ink-3)" }}>
                {ingredient.category.name.toUpperCase()}
              </span>
              {ingredient.eNumber && (
                <span className="font-mono-label text-[10px] px-2.5 py-1 rounded-full" style={{ background: "rgba(20,70,45,.06)", color: "var(--muted-2)" }}>
                  {ingredient.eNumber}
                </span>
              )}
              {ingredient.isNatural && (
                <span className="font-mono-label text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#dcfce7", color: "#15803d" }}>
                  🌿 NATURAL
                </span>
              )}
            </div>
            <h1 className="font-heading font-extrabold text-[30px] md:text-[36px] tracking-[-.02em]" style={{ color: "var(--ink)" }}>
              {ingredient.name}
            </h1>
            {ingredient.aliases.length > 0 && (
              <p className="text-sm mt-1.5" style={{ color: "var(--muted-3)" }}>Also known as: {ingredient.aliases.join(", ")}</p>
            )}
            <p className="mt-3 text-base leading-relaxed max-w-xl" style={{ color: "var(--muted)" }}>{ingredient.purposeShort}</p>
          </div>
          <div className="text-center flex-shrink-0">
            <GradeBadge score={ingredient.safetyScore} size="lg" className="mx-auto" />
            <p className="text-sm mt-2 font-mono-label" style={{ color: "var(--muted-2)" }}>{ingredient.safetyScore}/100</p>
          </div>
        </div>

        {/* Tags row */}
        <div className="mt-5 pt-5 flex flex-wrap items-center gap-3" style={{ borderTop: "1px solid var(--separator)" }}>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ color: evidenceConfig.text, background: evidenceConfig.bg, border: `1px solid ${evidenceConfig.border}` }}>
            <EvidenceIcon className="w-3.5 h-3.5" />
            {evidenceConfig.label}
          </div>
          {ingredient.adiValue && (
            <div className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe" }}>
              ADI: {ingredient.adiValue}
            </div>
          )}
          {ingredient.isVegan && (
            <div className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #a7e3ba" }}>
              🌱 Vegan
            </div>
          )}
          <div className="ml-auto text-xs" style={{ color: "var(--muted-3)" }}>
            Updated {new Date(ingredient.updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </div>
        </div>
      </Reveal>

      {/* Content grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <Reveal delay={0.05} className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="w-4 h-4" style={{ color: "#1e40af" }} />
            <h2 className="font-heading font-bold" style={{ color: "var(--ink-2)" }}>What it does</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{ingredient.purpose}</p>
        </Reveal>

        <Reveal delay={0.08} className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4" style={{ color: "var(--brand-700)" }} />
            <h2 className="font-heading font-bold" style={{ color: "var(--ink-2)" }}>Scientific consensus</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{ingredient.sciConsensus}</p>
        </Reveal>

        <Reveal delay={0.11} className="rounded-2xl p-6" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4" style={{ color: "#15803d" }} />
            <h2 className="font-heading font-bold" style={{ color: "#14532d" }}>Potential Benefits</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#15803d" }}>{ingredient.benefits}</p>
        </Reveal>

        <Reveal delay={0.14} className="rounded-2xl p-6" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4" style={{ color: "#b45309" }} />
            <h2 className="font-heading font-bold" style={{ color: "#78350f" }}>Potential Concerns</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#92400e" }}>{ingredient.concerns}</p>
        </Reveal>
      </div>

      {/* Regulatory status */}
      <Reveal delay={0.17} className="glass rounded-2xl p-6">
        <h2 className="font-heading font-bold mb-5" style={{ color: "var(--ink-2)" }}>Regulatory Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {regulatoryStatuses.map(({ org, status, flag }) => (
            <div key={org} className="text-center p-4 rounded-xl" style={{ background: "rgba(20,70,45,.04)" }}>
              <div className="text-2xl mb-1">{flag}</div>
              <div className="font-mono-label text-[11px] font-bold tracking-[.08em] mb-2" style={{ color: "var(--muted-3)" }}>{org}</div>
              <div className="text-xs leading-tight" style={{ color: "var(--ink-3)" }}>{status}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Common products */}
      {ingredient.commonProducts.length > 0 && (
        <Reveal delay={0.2} className="glass rounded-2xl p-6">
          <h2 className="font-heading font-bold mb-4" style={{ color: "var(--ink-2)" }}>Commonly found in</h2>
          <div className="flex flex-wrap gap-2">
            {ingredient.commonProducts.map((product) => (
              <span key={product} className="px-3 py-1.5 rounded-full text-xs" style={{ background: "rgba(20,70,45,.05)", border: "1px solid rgba(20,70,45,.1)", color: "var(--ink-3)" }}>
                {product}
              </span>
            ))}
          </div>
        </Reveal>
      )}

      {/* Research references */}
      {ingredient.references.length > 0 && (
        <Reveal delay={0.23} className="glass rounded-2xl p-6">
          <h2 className="font-heading font-bold mb-5" style={{ color: "var(--ink-2)" }}>Research References</h2>
          <div className="space-y-4">
            {ingredient.references.map((ref) => (
              <div key={ref.id} className="pb-4 last:pb-0" style={{ borderBottom: "1px solid var(--separator)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--ink-2)" }}>{ref.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-3)" }}>{ref.authors} · {ref.journal} · {ref.year}</p>
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>{ref.findings}</p>
                  </div>
                  {ref.doi && (
                    <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 transition-colors" style={{ color: "var(--brand-700)" }}>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl text-xs leading-relaxed" style={{ background: "rgba(20,70,45,.05)", color: "var(--muted-2)" }}>
        <strong style={{ color: "var(--ink-3)" }}>Educational Information:</strong> This ingredient profile is for informational purposes only
        and represents current scientific understanding. Individual responses to food additives can vary.
        Consult a healthcare professional for personalized dietary advice.
      </div>
    </div>
  );
}
