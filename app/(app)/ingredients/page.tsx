import { prisma } from "@/lib/prisma";
import { IngredientSearch } from "@/components/ingredients/IngredientSearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ingredient Database",
  description: "Search 2,000+ food ingredients including preservatives, sweeteners, colorings, emulsifiers, and more.",
};

export default async function IngredientsPage() {
  const categories = await prisma.ingredientCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div
      className="min-h-screen pb-tab-bar md:pb-16"
      style={{ background: "radial-gradient(120% 45% at 50% -8%, #e9f5ec 0%, #f6f5f1 46%, #f6f5f1 100%)" }}
    >
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-28 md:pt-32 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center font-mono-label font-semibold text-[11px] tracking-[.14em] px-3 py-1.5 rounded-full" style={{ color: "var(--brand-800)", background: "rgba(22,101,52,.09)", border: "1px solid rgba(22,101,52,.16)" }}>
            INGREDIENT DATABASE
          </div>
          <h1 className="font-heading font-extrabold text-[36px] md:text-[58px] leading-[.98] tracking-[-.03em] mt-4" style={{ color: "var(--ink)" }}>
            Decode any ingredient
          </h1>
          <p className="mt-4 max-w-[560px] mx-auto text-[17px] leading-relaxed" style={{ color: "var(--muted)" }}>
            Search 2,000+ additives, preservatives, sweeteners and colorings — each with an evidence-based grade and a plain-language verdict.
          </p>
        </div>

        <IngredientSearch categories={categories} />
      </div>
    </div>
  );
}
