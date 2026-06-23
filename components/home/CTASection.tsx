"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Scan, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 rounded-3xl p-12 md:p-16 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm font-medium mb-6">
              <Scan className="w-4 h-4" />
              Free to use · No account required
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Start understanding your food today
            </h2>
            <p className="text-green-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join millions of consumers making informed food choices. Scan your
              first product in seconds — no signup needed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/scan"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-900 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg shadow-black/20"
              >
                <Scan className="w-5 h-5" />
                Scan a Product Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ingredients"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Browse Ingredients
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
