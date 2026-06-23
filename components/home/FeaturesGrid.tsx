"use client";

import { motion } from "framer-motion";
import {
  Camera, Brain, Barcode, BarChart3, BookOpen, Users,
  Shield, Zap, Database,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Image Scanner",
    description:
      "Photograph any ingredient list. Our OCR extracts and analyzes every component instantly.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "GPT-4o powered explanations tailored for beginners, parents, athletes, and scientists.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Barcode,
    title: "Barcode Scanner",
    description:
      "Scan any product barcode to instantly retrieve full ingredient data via Open Food Facts.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: BarChart3,
    title: "Health Scoring",
    description:
      "A+ to F grading based on processing level, additive density, sugar, sodium, and nutrition.",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    icon: BookOpen,
    title: "Evidence-Based",
    description:
      "Every claim is backed by FDA, EFSA, WHO data and peer-reviewed research references.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: Database,
    title: "Ingredient Database",
    description:
      "2,000+ ingredients covering preservatives, sweeteners, colorings, emulsifiers, and more.",
    color: "text-navy-700",
    bg: "bg-slate-50",
    border: "border-slate-100",
  },
  {
    icon: Users,
    title: "Audience Modes",
    description:
      "Switch between Beginner, Parent, Athlete, and Scientific modes for tailored explanations.",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100",
  },
  {
    icon: Shield,
    title: "Trusted & Safe",
    description:
      "No unsupported health claims. Balanced, educational information you can actually trust.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "From scan to full analysis in under 3 seconds. Real-time ingredient lookups.",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-800 text-sm font-semibold rounded-full border border-green-200 mb-4">
            Everything you need
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4">
            Powerful features for <br />
            <span className="gradient-text">informed decisions</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            From scanning to scoring, NutriScan AI gives you the full picture
            of what&apos;s in your food — in plain language.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className={`group p-6 rounded-2xl border ${f.border} ${f.bg} card-hover cursor-default`}
              >
                <div className={`w-11 h-11 rounded-xl bg-white shadow-sm border ${f.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
