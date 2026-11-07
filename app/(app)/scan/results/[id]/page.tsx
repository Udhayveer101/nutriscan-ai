import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ResultsView } from "@/components/analysis/ResultsView";
import { detectAllergens, allergenPattern } from "@/lib/scoring";
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

  // Read the label text AND the linked row: linking can drop the allergen word
  // ("Emulsifier (Soy Lecithin)" → Lecithin, "Hydrolysed Soy Protein" → HVP).
  const namesOf = (i: { rawName: string; normalizedName: string | null }) =>
    i.normalizedName && i.normalizedName !== i.rawName ? [i.rawName, i.normalizedName] : [i.rawName];
  const allergens = detectAllergens(scan.ingredients.flatMap(namesOf));

  const ingredients = scan.ingredients.map((ing) => {
    const names = namesOf(ing).map((n) => n.toLowerCase());
    return {
      ...ing,
      // Word-boundary match — substring matching false-flagged e.g. "oat" in "benzOATe".
      triggersUserAllergen: userAllergens.some((a) => names.some((name) =>
        allergenPattern(a).test(name) ||
        allergens.some((m) => m.allergen === a && m.matchedIngredient.toLowerCase() === name)
      )),
      triggersUserAvoid: userAvoidList.some((a) => names.some((name) => allergenPattern(a).test(name))),
    };
  });

  return (
    <div
      className="min-h-screen pt-28 pb-16"
      style={{ background: "radial-gradient(110% 40% at 50% -8%, #e9f5ec 0%, #f6f5f1 46%, #f6f5f1 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <ResultsView scan={{ ...(scan as Parameters<typeof ResultsView>[0]["scan"]), ingredients, allergens }} />
      </div>
    </div>
  );
}
