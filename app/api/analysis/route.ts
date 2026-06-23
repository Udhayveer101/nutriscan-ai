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

    // 2. Look up each ingredient in DB
    const dbIngredients = await Promise.all(
      extractedNames.map(async (name) => {
        const found = await prisma.ingredient.findFirst({
          where: {
            OR: [
              { name: { equals: name, mode: "insensitive" } },
              { aliases: { has: name } },
              { eNumber: { equals: name, mode: "insensitive" } },
            ],
          },
          include: { category: true },
        });
        return { rawName: name, ingredient: found };
      })
    );

    // 3. Generate AI explanations for each ingredient
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
    // Detect ultra-processed products by high additive count or known junk food ingredients
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

    // 5. Detect allergens + cross-reference user preferences
    const allIngredientNames = ingredientExplanations.map((i) => i.normalizedName ?? i.rawName);
    const allergens = detectAllergens(allIngredientNames);

    // Load user's personal allergens and avoid list
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

    // Flag personal allergen/avoid matches on each ingredient
    const personalFlags = ingredientExplanations.map((ing) => {
      const name = (ing.normalizedName ?? ing.rawName).toLowerCase();
      const triggersUserAllergen = userAllergens.some((a) =>
        name.includes(a.toLowerCase()) || allergens.some((m) => m.allergen === a && m.matchedIngredient.toLowerCase() === name)
      );
      const triggersUserAvoid = userAvoidList.some((a) => name.includes(a.toLowerCase()));
      return { ...ing, triggersUserAllergen, triggersUserAvoid };
    });

    // 6. Generate product summary
    const productSummary = await generateProductSummary(
      "Scanned Product",
      extractedNames,
      { ...scoreBreakdown, gradeLabel: scoreBreakdown.gradeLabel },
      mode as ExplanationMode
    );

    // 7. Save scan to database
    const scan = await prisma.scan.create({
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
      include: { ingredients: { include: { ingredient: { include: { category: true } } } } },
    });

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
