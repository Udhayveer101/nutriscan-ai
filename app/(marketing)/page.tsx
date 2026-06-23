import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { IngredientPreview } from "@/components/home/IngredientPreview";
import { SocialProof } from "@/components/home/SocialProof";
import { CTASection } from "@/components/home/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NutriScan AI — Know What's Really In Your Food",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <IngredientPreview />
      <SocialProof />
      <CTASection />
    </>
  );
}
