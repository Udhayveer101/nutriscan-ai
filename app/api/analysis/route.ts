import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateIngredientExplanation, type ExplanationMode } from "@/lib/gemini";
import { parseIngredientList, sanitizeIngredients } from "@/lib/label-parser";
import { evaluateProduct, scoringName } from "@/lib/scoring";
import { getIngredientIndex } from "@/lib/ingredient-lookup";
import { scanUploadSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

// AI paragraphs only for rows worth a closer look — flagged (MEDIUM+) or not in the knowledge
// base — riskiest first. Groq's free tier allows ~1,000 output tokens/min per model, so every
// other row is saved with the KB's cited reason instead (the same text the score is built on).
const MAX_AI_EXPLANATIONS = 8;
const CONCERN_RANK = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 } as const;

export async function POST(req: NextRequest) {
  try {
    // Open to anonymous scans and triggers LLM calls — throttle per IP.
    const rl = rateLimit(clientKey(req, "analysis"), 15, 60_000);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
    }
    const body = await req.json();
    const parsed = scanUploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { method, text, ingredients, barcode, mode } = parsed.data;

    if (!text && !barcode && !ingredients?.length) {
      return NextResponse.json({ error: "No ingredient text or barcode provided" }, { status: 400 });
    }

    // Per-stage timings — measured, returned to the client, and logged.
    const t: Record<string, number> = {};
    const clock = () => performance.now();

    // 1. Ingredients: image scans send the array the OCR step already parsed; paste and
    //    barcode send text, parsed here deterministically (no LLM on the critical path).
    const rawText = text ?? "";
    let t0 = clock();
    // Started now, awaited in step 2; the no-op catch only stops an early 422 return from
    // leaving an unhandled rejection behind.
    const sessionP = auth();
    const indexP = getIngredientIndex(prisma);
    sessionP.catch(() => {});
    indexP.catch(() => {});
    const extractedNames = ingredients?.length ? sanitizeIngredients(ingredients) : parseIngredientList(rawText);
    t.extract = clock() - t0;

    if (!extractedNames.length) {
      return NextResponse.json({ error: "No ingredients could be extracted from the provided text" }, { status: 422 });
    }

    // 2. Link each name to its canonical DB row through the in-memory index (name, alias,
    //    E/INS/CAS code, bracket/plural clean-up, then guarded OCR-typo matching), then
    //    fetch only the matched rows by primary key.
    t0 = clock();
    const [index, session] = await Promise.all([indexP, sessionP]);
    const matches = extractedNames.map((name) => index.match(name));
    const ids = Array.from(new Set(matches.flatMap((m) => (m ? [m.row.id] : []))));
    const rows = ids.length
      ? await prisma.ingredient.findMany({ where: { id: { in: ids } }, include: { category: true } })
      : [];
    const byId = new Map(rows.map((r) => [r.id, r]));
    t.dbLookup = clock() - t0;

    // 3. Score — the KB is the single source of concern for both the product score and each row.
    t0 = clock();
    const scoringNames = extractedNames.map((rawName, i) => scoringName(rawName, matches[i]));
    const scoreBreakdown = evaluateProduct(scoringNames.map((name, position) => ({ name, position })));
    t.scoring = clock() - t0;

    // 4. Every ingredient is saved (the report and its allergen check read these rows),
    //    so additives in a "contains 2% or less of" tail are never dropped.
    const scanRows = extractedNames.map((rawName, i) => {
      const ingredient = matches[i] ? byId.get(matches[i]!.row.id) ?? null : null;
      const reason = scoreBreakdown.ingredientReasons?.[i];
      return {
        rawName,
        normalizedName: ingredient?.name ?? rawName,
        ingredientId: ingredient?.id ?? null,
        position: i,
        concernLevel: reason?.concern ?? "LOW",
        isRecognized: !!ingredient,
        reason: reason?.reason ?? "",
        promptCategory: ingredient?.category?.name ?? "Food Additive",
      };
    });
    const explainPositions = new Set(
      scanRows
        .filter((r) => r.concernLevel !== "LOW" || r.reason.startsWith("Unrecognised"))
        .sort((a, b) => CONCERN_RANK[b.concernLevel] - CONCERN_RANK[a.concernLevel] || a.position - b.position)
        .slice(0, MAX_AI_EXPLANATIONS)
        .map((r) => r.position)
    );

    // 5. Persist the scan. Rows that get an AI paragraph start empty; the rest carry the KB reason.
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
          create: scanRows.map((r) => ({
            ingredientId: r.ingredientId,
            rawName: r.rawName,
            normalizedName: r.normalizedName,
            position: r.position,
            aiExplanation: explainPositions.has(r.position) ? "" : r.reason,
            concernLevel: r.concernLevel,
            isRecognized: r.isRecognized,
          })),
        },
      },
      select: { id: true, ingredients: { select: { id: true, position: true } } },
    });
    t.save = clock() - t0;

    // 6. Deferred explanations — generated after the response is sent (next/server `after`),
    //    written to the ScanIngredient rows; the results page polls until they arrive.
    const explanationMode = mode as ExplanationMode;
    after(async () => {
      await Promise.all(
        scan.ingredients.filter((row) => explainPositions.has(row.position)).map(async (row) => {
          const src = scanRows[row.position];
          try {
            const explanation = await generateIngredientExplanation({
              ingredientName: src.normalizedName,
              category: src.promptCategory,
              mode: explanationMode,
              context: src.reason.startsWith("Unrecognised") ? undefined : src.reason,
            });
            await prisma.scanIngredient.update({ where: { id: row.id }, data: { aiExplanation: explanation } });
          } catch (err) {
            // Fall back to the KB reason so the row isn't left blank and polling can finish.
            console.error("deferred explanation failed", src.rawName, err);
            await prisma.scanIngredient.update({ where: { id: row.id }, data: { aiExplanation: src.reason } }).catch(() => {});
          }
        })
      );
    });
    t.total = Object.values(t).reduce((a, b) => a + b, 0);

    const timings = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, Math.round(v)]));
    console.log("[analysis timings ms]", timings);

    return NextResponse.json({
      scanId: scan.id,
      scoreBreakdown,
      totalIngredients: extractedNames.length,
      recognizedCount: scanRows.filter((r) => r.isRecognized).length,
      timings,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
