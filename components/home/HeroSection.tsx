"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Scan, Shield, Zap, ChevronDown } from "lucide-react";
import { ScannerMockup } from "./ScannerMockup";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50/30" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0f5132 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-900/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Copy */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-800 text-sm font-medium mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-emerald" />
            AI-Powered Ingredient Analysis
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-navy-900 mb-6"
          >
            Know What&apos;s{" "}
            <span className="relative">
              <span className="gradient-text">Really Inside</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 9C50 3 100 1 150 3C200 5 250 7 299 4"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            Your Food
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10 max-w-lg"
          >
            Scan any ingredient list and instantly understand preservatives,
            additives, sweeteners, and other food components through
            evidence-based AI analysis.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link href="/scan" className="btn-primary px-8 py-4 text-base shadow-lg shadow-green-900/20">
              <Scan className="w-5 h-5" />
              Scan a Product
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/ingredients" className="btn-secondary px-8 py-4 text-base">
              Browse Ingredients
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6"
          >
            {[
              { icon: Shield, text: "Evidence-based analysis" },
              { icon: Zap, text: "Results in seconds" },
              { icon: Scan, text: "2000+ ingredients" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-gray-500">
                <Icon className="w-4 h-4 text-emerald" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Scanner Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <ScannerMockup />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
      >
        <span className="text-xs">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
