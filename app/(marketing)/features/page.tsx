import type { Metadata } from "next";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description: "AI-powered ingredient scanning, OCR, barcode lookup, health scoring and more.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero Section */}
      <div className="text-white py-20 px-4 pt-32 md:pt-40" style={{ background: "linear-gradient(165deg,#0b1f16 0%,#123024 55%,#0e5231 130%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(74,222,128,.2)" }}>
              <Sparkles className="w-6 h-6" style={{ color: "#4ade80" }} />
            </div>
            <div>
              <div className="font-mono-label text-sm font-semibold tracking-wider" style={{ color: "#4ade80" }}>PRODUCT FEATURES</div>
              <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-[-.02em]">Everything you need to understand your food</h1>
            </div>
          </div>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            From AI-powered ingredient scanning to evidence-based health scoring — NutriScan AI gives you the complete picture of what&apos;s in your food.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="py-4">
        <FeaturesGrid />
      </div>

      {/* How It Works */}
      <div className="py-4">
        <HowItWorks />
      </div>
    </div>
  );
}
