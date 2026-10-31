import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { extractIngredientsFromText, sanitizeIngredients, generateIngredientExplanation, type ExplanationMode } from "@/lib/gemini";
import { evaluateProduct, inferConcernLevel, adjustConcernForConcentration, detectAllergens, allergenPattern, isRecognised } from "@/lib/scoring";
import { getIngredientIndex } from "@/lib/ingredient-lookup";
import { scanUploadSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Expensive endpoint (calls paid LLM APIs) and open to anonymous scans — throttle per IP.
    const rl = rateLimit(clientKey(req, "analysis"), 15, 60_000);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
    }
    const session = await auth();
    const body = await req.json();
    const parsed = scanUploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { method, text, ingredients, barcode, mode } = parsed.data;

    if (!text && !barcode && !ingredients?.length) {
      return NextResponse.json({ error: "No ingredient text or barcode provided" }, { status: 400 });
    }

    // Per-stage timings (Phase 5) — measured, returned to the client, and logged.
    const t: Record<string, number> = {};
    const clock = () => performance.now();

    // 1. Ingredients: prefer the structured array from the OCR contract (image scans
    //    already parsed it, so skip the LLM extraction call). Fall back to extracting
    //    from raw text only for paste/barcode paths.
    const rawText = text ?? "";
    let t0 = clock();
    const extractedNames = ingredients?.length
      ? sanitizeIngredients(ingredients)
      : await extractIngredientsFromText(rawText);
    t.extract = clock() - t0;

    if (!extractedNames.length) {
      return NextResponse.json({ error: "No ingredients could be extracted from the provided text" }, { status: 422 });
    }

    // 2. Link each name to its canonical DB row through the in-memory index (name, alias,
    //    E/INS/CAS code, bracket/plural clean-up, then guarded OCR-typo matching), then
    //    fetch only the matched rows by primary key. User prefs load in parallel.
    t0 = clock();
    const [index, userPrefs] = await Promise.all([
      getIngredientIndex(prisma),
      session?.user?.id
        ? prisma.user.findUnique({
            where: { id: session.user.id },
            select: { allergens: true, avoidList: true },
          })
        : Promise.resolve(null),
    ]);
    const matches = extractedNames.map((name) => index.match(name));
    const ids = Array.from(new Set(matches.flatMap((m) => (m ? [m.row.id] : []))));
    const rows = ids.length
      ? await prisma.ingredient.findMany({ where: { id: { in: ids } }, include: { category: true } })
      : [];
    const byId = new Map(rows.map((r) => [r.id, r]));
    const dbIngredients = extractedNames.map((name, i) => ({
      rawName: name,
      ingredient: matches[i] ? byId.get(matches[i]!.row.id) ?? null : null,
    }));
    t.dbLookup = clock() - t0;

    // Score what the label says. Two exceptions, both only when the KB can't read the raw
    // text: an OCR typo scores as the spelling it was corrected to, and a code the KB lacks
    // scores as the row it names. Alias links never change the score (the KB leaves some
    // names, such as bare "yeast", unrecognised on purpose).
    const scoringNames = extractedNames.map((rawName, i) => {
      const m = matches[i];
      if (!m || isRecognised(rawName)) return rawName;
      if (m.via === "fuzzy") return m.key;
      if (m.via === "code") return m.row.name;
      return rawName;
    });

    // 3. Score first — needs only names+positions (~4 ms), so the product summary
    //    can run in parallel with the per-ingredient explanations instead of after
    //    them (summary depends on the score, not on the explanations).
    t0 = clock();
    const scoreBreakdown = evaluateProduct(
      scoringNames.map((name, position) => ({ name, position }))
    );
    t.scoring = clock() - t0;

    // 4. Ingredient rows — fully deterministic (KB/DB concern, normalization),
    //    no LLM. Explanations are generated AFTER the response (progressive
    //    loading): the user sees the grade, bars, and risk-sorted list
    //    immediately; paragraphs fill in when ready.
    //    (The old generateProductSummary call was removed outright — its output
    //    was returned in JSON but never rendered anywhere. One LLM call/scan saved.)
    const ingredientExplanations = dbIngredients.slice(0, 15).map(({ rawName, ingredient }, i) => ({
      rawName,
      normalizedName: ingredient?.name ?? rawName,
      ingredientId: ingredient?.id ?? null,
      position: i,
      aiExplanation: "",
      promptCategory: ingredient?.category?.name ?? "Food Additive",
      concernLevel: (() => {
        const inferred = inferConcernLevel(scoringNames[i]);
        // Resolve base concern: CRITICAL never overridden; DB safety score used if available
        const base: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" =
          inferred === "CRITICAL" ? "CRITICAL"
          : ingredient?.safetyScore !== undefined
            ? ingredient.safetyScore >= 70 ? "LOW" : ingredient.safetyScore >= 50 ? "MEDIUM" : "HIGH"
            : inferred;
        // Adjust for concentration: ingredients at position 0 = most abundant; position 8+ = trace
        return adjustConcernForConcentration(scoringNames[i], base, i);
      })(),
      isRecognized: !!ingredient,
      category: ingredient?.category?.name,
      safetyScore: ingredient?.safetyScore ?? 65,
      isNatural: ingredient?.isNatural ?? false,
    }));

    // 5. Detect allergens + apply user prefs (prefs already fetched in step 2)
    const allIngredientNames = ingredientExplanations.map((i) => i.normalizedName ?? i.rawName);
    const allergens = detectAllergens(allIngredientNames);

    const userAllergens = userPrefs?.allergens ?? [];
    const userAvoidList = userPrefs?.avoidList ?? [];

    const personalFlags = ingredientExplanations.map((ing) => {
      const name = (ing.normalizedName ?? ing.rawName).toLowerCase();
      // Word-boundary match (allergenPattern) — plain substring matching false-flagged
      // e.g. user allergen "oat" against "sodium benzOATe".
      const triggersUserAllergen = userAllergens.some((a) =>
        allergenPattern(a).test(name) || allergens.some((m) => m.allergen === a && m.matchedIngredient.toLowerCase() === name)
      );
      const triggersUserAvoid = userAvoidList.some((a) => allergenPattern(a).test(name));
      return { ...ing, triggersUserAllergen, triggersUserAvoid };
    });

    // 6. Persist the scan (explanation paragraphs still empty at this point)
    t0 = clock();
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
        select: { id: true, ingredients: { select: { id: true, position: true } } },
      });
    t.save = clock() - t0;

    // 7. Deferred explanations — generated after the response is sent (next/server
    //    `after`), written to the ScanIngredient rows; the results page polls
    //    /api/scans/[id]/explanations until they arrive.
    const explanationMode = mode as ExplanationMode;
    after(async () => {
      try {
        await Promise.all(
          scan.ingredients.map(async (row) => {
            const src = ingredientExplanations[row.position];
            if (!src) return;
            const explanation = await generateIngredientExplanation({
              ingredientName: src.normalizedName ?? src.rawName,
              category: src.promptCategory,
              mode: explanationMode,
            });
            await prisma.scanIngredient.update({
              where: { id: row.id },
              data: { aiExplanation: explanation },
            });
          })
        );
      } catch (err) {
        // Non-fatal: the report is complete without paragraphs; the UI stops
        // polling and keeps the deterministic content.
        console.error("deferred explanation generation failed", err);
      }
    });
    t.total = Object.values(t).reduce((a, b) => a + b, 0);

    const timings = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, Math.round(v)]));
    console.log("[analysis timings ms]", timings);

    return NextResponse.json({
      scanId: scan.id,
      scoreBreakdown,
      ingredients: personalFlags,
      allergens,
      userAllergens,
      userAvoidList,
      totalIngredients: extractedNames.length,
      recognizedCount: ingredientExplanations.filter((i) => i.isRecognized).length,
      timings,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
