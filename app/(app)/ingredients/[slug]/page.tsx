import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { IngredientDetail } from "@/components/ingredients/IngredientDetail";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = await prisma.ingredient.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!ingredient) return { title: "Ingredient Not Found" };
  return {
    title: `${ingredient.name} — ${ingredient.category.name}`,
    description: ingredient.purposeShort,
    openGraph: {
      title: `${ingredient.name} | NutriScan AI`,
      description: ingredient.purposeShort,
    },
  };
}

export default async function IngredientPage({ params }: Props) {
  const { slug } = await params;

  const ingredient = await prisma.ingredient.findUnique({
    where: { slug },
    include: {
      category: true,
      references: { orderBy: { year: "desc" }, take: 5 },
    },
  });

  if (!ingredient) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/20 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <IngredientDetail ingredient={ingredient as Parameters<typeof IngredientDetail>[0]["ingredient"]} />
      </div>
    </div>
  );
}
