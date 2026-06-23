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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-green-950 text-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Product Features</div>
              <h1 className="text-4xl md:text-5xl font-extrabold">Everything You Need to Understand Your Food</h1>
            </div>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            From AI-powered ingredient scanning to evidence-based health scoring — NutriScan AI gives you the complete picture of what's in your food.
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
