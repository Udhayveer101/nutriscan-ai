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
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-800 text-sm font-semibold rounded-full border border-green-200 mb-4">
            Ingredient Database
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4">
            Decode any ingredient
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Search our comprehensive database of 2,000+ food additives, preservatives,
            sweeteners, colorings, and more — all with evidence-based explanations.
          </p>
        </div>

        <IngredientSearch categories={categories} />
      </div>
    </div>
  );
}
