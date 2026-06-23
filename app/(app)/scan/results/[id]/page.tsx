import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ResultsView } from "@/components/analysis/ResultsView";
import { detectAllergens } from "@/lib/scoring";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const scan = await prisma.scan.findUnique({ where: { id } });
  return {
    title: scan?.productName ? `Analysis: ${scan.productName}` : "Scan Results",
  };
}

export default async function ResultsPage({ params }: Props) {
  const { id } = await params;

  const scan = await prisma.scan.findUnique({
    where: { id },
    include: {
      ingredients: {
        include: {
          ingredient: { include: { category: true } },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!scan) notFound();

  const session = await auth();
  let userAllergens: string[] = [];
  let userAvoidList: string[] = [];
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { allergens: true, avoidList: true },
    });
    userAllergens = user?.allergens ?? [];
    userAvoidList = user?.avoidList ?? [];
  }

  const ingredientNames = scan.ingredients.map((i) => i.normalizedName ?? i.rawName);
  const allergens = detectAllergens(ingredientNames);

  const ingredients = scan.ingredients.map((ing) => {
    const name = (ing.normalizedName ?? ing.rawName).toLowerCase();
    return {
      ...ing,
      triggersUserAllergen: userAllergens.some((a) =>
        name.includes(a.toLowerCase()) ||
        allergens.some((m) => m.allergen === a && m.matchedIngredient.toLowerCase() === name)
      ),
      triggersUserAvoid: userAvoidList.some((a) => name.includes(a.toLowerCase())),
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <ResultsView scan={{ ...(scan as Parameters<typeof ResultsView>[0]["scan"]), ingredients, allergens }} />
      </div>
    </div>
  );
}
