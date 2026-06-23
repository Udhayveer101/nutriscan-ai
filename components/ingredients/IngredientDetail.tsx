"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Info, ExternalLink, Shield, FlaskConical } from "lucide-react";

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

const EVIDENCE_CONFIG = {
  STRONG: { label: "Strong Evidence", color: "text-green-700 bg-green-50 border-green-300", icon: CheckCircle2 },
  MODERATE: { label: "Moderate Evidence", color: "text-blue-700 bg-blue-50 border-blue-300", icon: Info },
  LIMITED: { label: "Limited Evidence", color: "text-amber-700 bg-amber-50 border-amber-300", icon: AlertCircle },
  INSUFFICIENT: { label: "Insufficient Evidence", color: "text-gray-700 bg-gray-50 border-gray-300", icon: Info },
};

function getGrade(score: number) {
  if (score >= 90) return { label: "A+", color: "from-green-600 to-emerald-500" };
  if (score >= 80) return { label: "A", color: "from-green-600 to-green-500" };
  if (score >= 70) return { label: "B", color: "from-lime-600 to-lime-500" };
  if (score >= 55) return { label: "C", color: "from-amber-600 to-amber-500" };
  if (score >= 40) return { label: "D", color: "from-orange-600 to-orange-500" };
  return { label: "F", color: "from-red-600 to-red-500" };
}

export function IngredientDetail({ ingredient }: { ingredient: Ingredient }) {
  const evidenceConfig = EVIDENCE_CONFIG[ingredient.evidenceLevel as keyof typeof EVIDENCE_CONFIG] ?? EVIDENCE_CONFIG.MODERATE;
  const EvidenceIcon = evidenceConfig.icon;
  const grade = getGrade(ingredient.safetyScore);

  const regulatoryStatuses = [
    { org: "FDA", status: ingredient.fdaStatus, flag: "🇺🇸" },
    { org: "EFSA", status: ingredient.efsaStatus, flag: "🇪🇺" },
    { org: "FSSAI", status: ingredient.fssaiStatus, flag: "🇮🇳" },
    { org: "WHO", status: ingredient.whoStatus, flag: "🌍" },
  ];

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/ingredients"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Ingredient Database
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className={`bg-gradient-to-br ${grade.color} p-8`}>
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{ingredient.category.icon}</span>
                <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
                  {ingredient.category.name}
                </span>
                {ingredient.eNumber && (
                  <span className="px-3 py-1 bg-white/20 text-white text-xs font-mono rounded-full">
                    {ingredient.eNumber}
                  </span>
                )}
                {ingredient.isNatural && (
                  <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
                    🌿 Natural
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                {ingredient.name}
              </h1>
              {ingredient.aliases.length > 0 && (
                <p className="text-white/70 text-sm">
                  Also known as: {ingredient.aliases.join(", ")}
                </p>
              )}
              <p className="text-white/90 mt-3 text-base leading-relaxed max-w-xl">
                {ingredient.purposeShort}
              </p>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <span className="text-5xl font-black text-white">{grade.label}</span>
              </div>
              <p className="text-white/70 text-sm mt-1">{ingredient.safetyScore}/100</p>
            </div>
          </div>
        </div>

        {/* Tags row */}
        <div className="px-8 py-4 flex flex-wrap items-center gap-3 border-t border-gray-100">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${evidenceConfig.color}`}>
            <EvidenceIcon className="w-3.5 h-3.5" />
            {evidenceConfig.label}
          </div>
          {ingredient.adiValue && (
            <div className="px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold">
              ADI: {ingredient.adiValue}
            </div>
          )}
          {ingredient.isVegan && (
            <div className="px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-semibold">
              🌱 Vegan
            </div>
          )}
          <div className="ml-auto text-xs text-gray-400">
            Updated {new Date(ingredient.updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </div>
        </div>
      </motion.div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Purpose */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-gray-900">What it does</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{ingredient.purpose}</p>
        </motion.div>

        {/* Scientific consensus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-600" />
            <h2 className="font-bold text-gray-900">Scientific consensus</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{ingredient.sciConsensus}</p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 rounded-2xl border border-green-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <h2 className="font-bold text-green-900">Potential Benefits</h2>
          </div>
          <p className="text-sm text-green-800 leading-relaxed">{ingredient.benefits}</p>
        </motion.div>

        {/* Concerns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-amber-50 rounded-2xl border border-amber-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-amber-900">Potential Concerns</h2>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">{ingredient.concerns}</p>
        </motion.div>
      </div>

      {/* Regulatory status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >
        <h2 className="font-bold text-gray-900 mb-5">Regulatory Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {regulatoryStatuses.map(({ org, status, flag }) => (
            <div key={org} className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-1">{flag}</div>
              <div className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">{org}</div>
              <div className="text-xs text-gray-700 leading-tight">{status}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Common products */}
      {ingredient.commonProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h2 className="font-bold text-gray-900 mb-4">Commonly found in</h2>
          <div className="flex flex-wrap gap-2">
            {ingredient.commonProducts.map((product) => (
              <span
                key={product}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600"
              >
                {product}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Research references */}
      {ingredient.references.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h2 className="font-bold text-gray-900 mb-5">Research References</h2>
          <div className="space-y-4">
            {ingredient.references.map((ref) => (
              <div key={ref.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">{ref.title}</p>
                    <p className="text-xs text-gray-500">
                      {ref.authors} · {ref.journal} · {ref.year}
                    </p>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{ref.findings}</p>
                  </div>
                  {ref.doi && (
                    <a
                      href={`https://doi.org/${ref.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-green-700 hover:text-green-900 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-500 leading-relaxed">
        <strong>Educational Information:</strong> This ingredient profile is for informational purposes only
        and represents current scientific understanding. Individual responses to food additives can vary.
        Consult a healthcare professional for personalized dietary advice.
      </div>
    </div>
  );
}
