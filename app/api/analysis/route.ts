import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { extractIngredientsFromText, generateIngredientExplanation, generateProductSummary, type ExplanationMode } from "@/lib/gemini";
import { calculateHealthScore, inferConcernLevel, detectAllergens } from "@/lib/scoring";
import { scanUploadSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = scanUploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { method, text, barcode, mode } = parsed.data;

    if (!text && !barcode) {
      return NextResponse.json({ error: "No ingredient text or barcode provided" }, { status: 400 });
    }

    // 1. Extract ingredients from text
    const rawText = text ?? "";
    const extractedNames = await extractIngredientsFromText(rawText);

    if (!extractedNames.length) {
      return NextResponse.json({ error: "No ingredients could be extracted from the provided text" }, { status: 422 });
    }

    // 2. Single DB query for all ingredients + user prefs in parallel
    const [allFound, userPrefs] = await Promise.all([
      prisma.ingredient.findMany({
        where: {
          OR: extractedNames.flatMap((name) => [
            { name: { equals: name, mode: "insensitive" as const } },
            { eNumber: { equals: name, mode: "insensitive" as const } },
          ]),
        },
        include: { category: true },
      }),
      session?.user?.id
        ? prisma.user.findUnique({
            where: { id: session.user.id },
            select: { allergens: true, avoidList: true },
          })
        : Promise.resolve(null),
    ]);

    // Match each name to a DB record (in-memory, no extra queries)
    const dbIngredients = extractedNames.map((name) => {
      const lower = name.toLowerCase();
      const ingredient =
        allFound.find(
          (r) =>
            r.name.toLowerCase() === lower ||
            r.eNumber?.toLowerCase() === lower ||
            r.aliases.some((a) => a.toLowerCase() === lower)
        ) ?? null;
      return { rawName: name, ingredient };
    });

    // 3. Generate AI explanations for all ingredients in parallel
    const ingredientExplanations = await Promise.all(
      dbIngredients.slice(0, 15).map(async ({ rawName, ingredient }, i) => {
        const explanation = await generateIngredientExplanation({
          ingredientName: ingredient?.name ?? rawName,
          category: ingredient?.category?.name ?? "Food Additive",
          mode: mode as ExplanationMode,
        });

        return {
          rawName,
          normalizedName: ingredient?.name ?? rawName,
          ingredientId: ingredient?.id ?? null,
          position: i,
          aiExplanation: explanation,
          concernLevel: (() => {
            const inferred = inferConcernLevel(rawName);
            if (inferred === "CRITICAL") return "CRITICAL";
            if (ingredient?.safetyScore !== undefined) {
              return ingredient.safetyScore >= 70 ? "LOW" : ingredient.safetyScore >= 50 ? "MEDIUM" : "HIGH";
            }
            return inferred;
          })(),
          isRecognized: !!ingredient,
          category: ingredient?.category?.name,
          safetyScore: ingredient?.safetyScore ?? 65,
          isNatural: ingredient?.isNatural ?? false,
        };
      })
    );

    // 4. Calculate health scores
    const highConcernCount = ingredientExplanations.filter((i) => i.concernLevel === "HIGH").length;
    const isUltraProcessed = highConcernCount >= 2 || ingredientExplanations.length > 10;

    const scoreBreakdown = calculateHealthScore(
      ingredientExplanations.map((i) => ({
        name: i.normalizedName,
        safetyScore: i.safetyScore,
        concernLevel: i.concernLevel as "LOW" | "MEDIUM" | "HIGH",
        isNatural: i.isNatural,
        category: i.category,
      })),
      0,
      0,
      isUltraProcessed
    );

    // 5. Detect allergens + apply user prefs (prefs already fetched in step 2)
    const allIngredientNames = ingredientExplanations.map((i) => i.normalizedName ?? i.rawName);
    const allergens = detectAllergens(allIngredientNames);

    const userAllergens = userPrefs?.allergens ?? [];
    const userAvoidList = userPrefs?.avoidList ?? [];

    const personalFlags = ingredientExplanations.map((ing) => {
      const name = (ing.normalizedName ?? ing.rawName).toLowerCase();
      const triggersUserAllergen = userAllergens.some((a) =>
        name.includes(a.toLowerCase()) || allergens.some((m) => m.allergen === a && m.matchedIngredient.toLowerCase() === name)
      );
      const triggersUserAvoid = userAvoidList.some((a) => name.includes(a.toLowerCase()));
      return { ...ing, triggersUserAllergen, triggersUserAvoid };
    });

    // 6. Product summary + DB save in parallel
    const [productSummary, scan] = await Promise.all([
      generateProductSummary(
        "Scanned Product",
        extractedNames,
        { ...scoreBreakdown, gradeLabel: scoreBreakdown.gradeLabel },
        mode as ExplanationMode
      ),
      prisma.scan.create({
        data: {
          userId: session?.user?.id ?? null,
          method: method as "IMAGE" | "PASTE" | "BARCODE" | "CAMERA",
          rawText,
          barcode: barcode ?? null,
          overallScore: scoreBreakdown.overall,
          grade: scoreBreakdown.grade,
          scoreBreakdown: scoreBreakdown as unknown as Prisma.InputJsonValue,
          ingredients: {
            create: ingredientExplanations.map((ie) => ({
              ingredientId: ie.ingredientId,
              rawName: ie.rawName,
              normalizedName: ie.normalizedName,
              position: ie.position,
              aiExplanation: ie.aiExplanation,
              concernLevel: ie.concernLevel as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
              isRecognized: ie.isRecognized,
            })),
          },
        },
        select: { id: true },
      }),
    ]);

    return NextResponse.json({
      scanId: scan.id,
      productSummary,
      scoreBreakdown,
      ingredients: personalFlags,
      allergens,
      userAllergens,
      userAvoidList,
      totalIngredients: extractedNames.length,
      recognizedCount: ingredientExplanations.filter((i) => i.isRecognized).length,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
