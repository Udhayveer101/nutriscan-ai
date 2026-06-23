"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, BarChart3, Lightbulb } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload or Scan",
    description:
      "Take a photo of the ingredient list, use your camera, paste text, or scan a barcode.",
    color: "bg-violet-500",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Extraction",
    description:
      "Our OCR and NLP pipeline extracts, normalizes, and identifies every ingredient.",
    color: "bg-emerald-500",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Health Scoring",
    description:
      "Each ingredient is scored and a composite product health grade is generated.",
    color: "bg-blue-500",
  },
  {
    step: "04",
    icon: Lightbulb,
    title: "Clear Explanations",
    description:
      "Get plain-language breakdowns personalized to your mode: Beginner, Parent, or Scientist.",
    color: "bg-amber-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-navy-800/5 text-navy-800 text-sm font-semibold rounded-full border border-navy-800/10 mb-4">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4">
            From scan to insight <br />
            <span className="gradient-text">in under 3 seconds</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-violet-200 via-emerald-200 via-blue-200 to-amber-200" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`relative w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-gray-100 text-[10px] font-black text-gray-600 flex items-center justify-center shadow-sm">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
