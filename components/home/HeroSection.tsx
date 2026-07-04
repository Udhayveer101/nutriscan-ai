"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScannerMockup } from "./ScannerMockup";

export function HeroSection() {
  return (
    <div style={{ background: "radial-gradient(130% 60% at 88% -6%, #e9f5ec 0%, #f6f5f1 42%, #f6f5f1 100%)" }} className="overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-[1.12fr_.88fr] gap-9 pt-32 md:pt-40 pb-10 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}>
            <div
              className="inline-flex items-center gap-2 font-mono-label font-semibold text-[11px] tracking-[.14em] px-3 py-1.5 rounded-full"
              style={{ color: "var(--brand-800)", background: "rgba(22,101,52,.09)", border: "1px solid rgba(22,101,52,.16)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand-600)", boxShadow: "0 0 0 4px rgba(22,163,74,.18)" }} />
              EVIDENCE-BASED FOOD INTELLIGENCE
            </div>

            <h1 className="font-heading font-extrabold text-[42px] sm:text-[54px] lg:text-[64px] leading-[.98] tracking-[-.03em] mt-5" style={{ color: "var(--ink)" }}>
              Know what&apos;s<br />
              <span className="relative inline-block">
                really inside
                <span className="absolute left-[-4px] right-[-4px] bottom-[6px] h-[16px] -z-10 rounded-[3px] opacity-50" style={{ background: "linear-gradient(90deg,#4ade80,#16a34a)" }} />
              </span>
              <br />your food.
            </h1>

            <p className="mt-6 max-w-[440px] text-[17px] leading-relaxed" style={{ color: "var(--muted)" }}>
              Point your camera at any ingredient list. We decode every preservative, additive and sweetener — and tell you, in plain language, what the science actually says.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link href="/scan" className="btn-primary">
                Scan a product <span className="text-[17px]">→</span>
              </Link>
              <Link href="/ingredients" className="glass btn-secondary">
                Browse the database
              </Link>
            </div>

            <div className="mt-9 max-w-[430px] flex flex-col gap-3.5">
              {[
                { label: "EVIDENCE STRENGTH", value: "STRONG", w: 88 },
                { label: "REGULATORY COVERAGE", value: "FDA · EFSA · WHO", w: 94 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between font-mono-label text-[10.5px] tracking-[.05em] mb-1.5" style={{ color: "var(--muted-2)" }}>
                    <span>{row.label}</span>
                    <span style={{ color: "var(--teal-600)" }}>{row.value}</span>
                  </div>
                  <div className="h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(13,80,60,.1)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg,#34d399,#0d9488)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${row.w}%` }}
                      transition={{ duration: 1.3, delay: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}>
            <ScannerMockup />
          </motion.div>
        </div>

        {/* HOW IT WORKS strip lives directly under the hero, matching the mockup layout */}
      </div>
    </div>
  );
}
