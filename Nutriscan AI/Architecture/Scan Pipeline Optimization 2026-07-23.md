---
type: architecture-decision
date: 2026-07-23
scope: scan → analysis pipeline (OCR, explanation generation, UI)
---

# Scan Pipeline Optimization — 2026-07-23

## Audit: where the flow actually spends time/text

Capture → OCR (`lib/vision.ts`) → ingredient extraction (`extractIngredientsFromText`,
1 Groq call) → DB lookup (already parallel, single `findMany`) → **per-ingredient
explanation (`generateIngredientExplanation`, up to 15 parallel Groq calls)** →
product summary (1 Groq call) → score (`lib/scoring.ts`, sync, cheap) → render.

**The dominant cost was the per-ingredient explanation step**: 15 parallel calls each
generating a 150–200 word, 5-part paragraph. Parallel calls hide round-trip latency,
but each call's *generation time scales with output tokens* — so the 150-200 word
target was the real latency floor, and it was also the entire cause of the "too much
text" complaint. One fix serves both objectives.

Other findings:
- OCR quality gate was text-length only (`text.length < 10`) — didn't actually check
  whether the text resembled an ingredient list before deciding to fall back.
- No client-side image downscaling — full-resolution photos were uploaded and
  base64-inlined into the OCR request as-is.
- Ingredients rendered in raw label order, not risk order.

## Changes made

1. **`lib/gemini.ts`** — `generateIngredientExplanation` prompt cut from a 5-part
   150-200 word structure to "1-2 sentences, lead with the concern," `max_tokens: 90`.
   `generateProductSummary` capped at `max_tokens: 120`. This is the single highest-
   leverage change: cuts output tokens ~4-5x on the call that dominates both wall-clock
   time and on-page text volume.
2. **`components/analysis/ResultsView.tsx`** — ingredients sorted by risk
   (CRITICAL → HIGH → MEDIUM → LOW, with LOW split into recognized/beneficial before
   unrecognized/neutral) before render. `position` (label order) is untouched — it's
   still what scoring uses; sorting is display-only.
3. **`lib/vision.ts`** — `assessOcrQuality()` replaces the length heuristic: checks for
   an "Ingredients:" header, comma-item count, E-number regex, additive vocabulary.
   Drives both the Gemini→Groq fallback decision and the returned `confidence`, and
   picks whichever OCR pass structurally looks more like a real ingredient list rather
   than whichever ran second.
4. **`components/scan/UploadTab.tsx`** — client-side downscale to ~1600px longest edge
   (canvas `createImageBitmap` → draw → JPEG blob) before upload. Smaller payload, less
   time in `Buffer.from(...).toString("base64")` and in the OCR request itself. Skipped
   for HEIC (canvas can't decode it in-browser).

## Structured OCR contract (Stage 4/5/6) — built

`StructuredOcr` (`lib/vision.ts`) is now the object every downstream system consumes:
`{ ingredients[], rawText, ingredientText, confidence, ocrProvider, passesUsed, enhancedUsed }`.

- **Stage 4 (structuring):** `structuredOcrFromImageFile()` runs OCR → `extractIngredientsFromText`
  once, in the OCR upload endpoint. `/api/scan/upload` now returns the structured array,
  not a raw string.
- **Stage 5 (sanitization):** `sanitizeIngredients()` (`lib/gemini.ts`) — deterministic
  post-filter: dedupe (case/whitespace), drop empties, pure-numeric, nutrition rows, URLs,
  over-long OCR fragments. `extractIngredientsFromText` pipes through it.
- **Stage 6 (structured response):** the image path sends `ingredients[]` to `/api/analysis`,
  which consumes it directly and **skips re-extraction** (measured `extract: 0 ms`). Paste/
  barcode still extract server-side (they have no pre-parsed array). Net LLM calls unchanged.
- `enhancedUsed` is reserved (always `false`) until Stage 3 lands — shape is forward-compatible.

## Benchmarks (Phase 5) — measured, not assumed

**Per-stage timings** now instrument `/api/analysis` (returned as `timings`, logged server-side).
Live run, 5-ingredient product, structured path:

| stage | ms |
|---|---|
| extract | **0** (structured array — extraction skipped) |
| dbLookup | 18 |
| explanations | **865** |
| scoring | 1 |
| summaryAndSave | 624 |
| **total** | **1508** |

→ **~99% of scan time is LLM generation** (explanations + summary). This confirms the audit:
the per-ingredient explanation stage is the bottleneck, and it's exactly what was shortened.

**Explanation A/B** (`scripts/bench-scan.ts`, OLD 150-200 word prompt vs NEW 1-2 sentence /
`max_tokens: 90`, 5 ingredients in parallel, 3 runs):

| metric | OLD | NEW | reduction |
|---|---|---|---|
| output tokens | 830-855 | 259-292 | **−65 to −69%** (stable) |
| words | 644-665 | 209-229 | **−64 to −68%** (stable) |
| wall-clock | 843-2023 ms | 514-549 ms | −35 to −75% (noisy at 5 calls) |

Token/word reduction is the stable, defensible number. Wall-clock varies because at only 5
parallel calls the slowest generation dominates; the live app fans out up to 15 parallel
explanation calls, where capping `max_tokens` bounds the tail more consistently.

Run: `npx tsx --env-file=.env scripts/bench-scan.ts` (also runs the Stage-5 sanitizer self-check).

## Deferred (scoped but not built this pass)

Stage 0 blur detection (Variance-of-Laplacian), tap-to-focus, torch toggle, 3-frame
burst capture, and Stage 3 server-side enhanced-retry (grayscale/contrast/unsharp
re-OCR) were scoped but not implemented — they require either camera-API device
testing this environment can't do, or a new native image dependency (`sharp`) whose
cold-start cost on serverless needs to be weighed deliberately, not defaulted into.
Current fallback (Gemini → Groq, now gated by `assessOcrQuality` instead of length)
covers the same failure mode at lower cost. Build these if real-world scan failure
rate data shows the current gate isn't catching enough bad photos.

## Verification this pass

`npx tsc --noEmit` clean. `npx tsx scripts/validate-scoring.ts` → ALL PASS (unchanged —
scoring engine untouched). Manual run through `/scan` (Paste Text, example ingredients):
confirmed risk-sorted output (HIGH → MODERATE → LOW) and shortened explanations, no
console/server errors.
