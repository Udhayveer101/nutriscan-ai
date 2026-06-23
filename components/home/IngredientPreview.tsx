"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, Info } from "lucide-react";

const PREVIEW_INGREDIENTS = [
  {
    name: "Sodium Benzoate",
    eNumber: "E211",
    category: "Preservative",
    score: 55,
    grade: "C",
    concern: "moderate",
    icon: AlertCircle,
    slug: "sodium-benzoate",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    gradeColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    name: "Ascorbic Acid",
    eNumber: "E300",
    category: "Antioxidant",
    score: 92,
    grade: "A",
    concern: "low",
    icon: CheckCircle2,
    slug: "ascorbic-acid",
    tagColor: "bg-green-100 text-green-800 border-green-200",
    gradeColor: "text-green-700 bg-green-50 border-green-200",
  },
  {
    name: "Aspartame",
    eNumber: "E951",
    category: "Sweetener",
    score: 62,
    grade: "B",
    concern: "low",
    icon: Info,
    slug: "aspartame",
    tagColor: "bg-blue-100 text-blue-800 border-blue-200",
    gradeColor: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    name: "Red 40",
    eNumber: "E129",
    category: "Coloring",
    score: 40,
    grade: "D",
    concern: "high",
    icon: AlertCircle,
    slug: "red-40",
    tagColor: "bg-red-100 text-red-800 border-red-200",
    gradeColor: "text-red-700 bg-red-50 border-red-200",
  },
  {
    name: "Lecithin",
    eNumber: "E322",
    category: "Emulsifier",
    score: 88,
    grade: "A",
    concern: "low",
    icon: CheckCircle2,
    slug: "lecithin",
    tagColor: "bg-green-100 text-green-800 border-green-200",
    gradeColor: "text-green-700 bg-green-50 border-green-200",
  },
  {
    name: "Carrageenan",
    eNumber: "E407",
    category: "Stabilizer",
    score: 52,
    grade: "C",
    concern: "moderate",
    icon: AlertCircle,
    slug: "carrageenan",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    gradeColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
];

export function IngredientPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-800 text-sm font-semibold rounded-full border border-green-200 mb-4">
              Ingredient Database
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy-900">
              2,000+ ingredients <br />
              <span className="gradient-text">decoded for you</span>
            </h2>
          </div>
          <Link
            href="/ingredients"
            className="btn-secondary flex-shrink-0"
          >
            Browse all ingredients
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {PREVIEW_INGREDIENTS.map((ing) => {
            const Icon = ing.icon;
            return (
              <motion.div
                key={ing.slug}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
              >
                <Link
                  href={`/ingredients/${ing.slug}`}
                  className="block p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:border-green-200 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${ing.tagColor}`}>
                          {ing.category}
                        </span>
                        {ing.eNumber && (
                          <span className="text-xs text-gray-400 font-mono">{ing.eNumber}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-green-900 transition-colors">
                        {ing.name}
                      </h3>
                    </div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 font-black text-lg ${ing.gradeColor}`}>
                      {ing.grade}
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Safety Score</span>
                      <span className="font-semibold">{ing.score}/100</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${ing.score}%`,
                          background: ing.score >= 80 ? "#22c55e" : ing.score >= 60 ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="capitalize">{ing.concern} concern</span>
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-green-700" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
