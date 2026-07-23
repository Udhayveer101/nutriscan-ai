---
type: audit+implementation
date: 2026-07-23
scope: "Issue 1: grade vs category-bar inconsistency · Issue 2: slow report generation"
---

# Score Transparency & Progressive Results — 2026-07-23

## Issue 1 — "F grade but category bars ≈ 90–100"

**Audit verdict: the engine's math is correct and internally consistent; the UI was
hiding the parts that drive the grade.** Trace for the reported product (15 ingredients):

composite (from the displayed categories, weights 0.34/0.24/0.22, renormalised /0.80
without nutrition data) → **NOVA-4 ceiling caps at 40** → −20 (4 high-concern
additives) → −20 (benzene: benzoate + vitamin C) → −12 (dye hyperactivity mixture)
→ clamp → **0 = F**. Every step was already recorded in `ScoreBreakdown.reasons[]`
— it was simply never rendered. No double-counting, no hidden penalties beyond the
documented ones (see [[Scoring Methodology]]). **No scoring change was made.**

Two genuine display defects fixed instead:

1. **Sugar/Sodium showed "100/100" with no nutrition data.** The engine correctly
   excludes them from the composite (weight redistribution), but still emitted 100 and
   the UI displayed it — the main source of "bars say 95+, grade says F".
   → `ScoreBreakdown.hasNutrition` flag; `ResultsView` hides both bars when false.
2. **`reasons[]`/NOVA never rendered.** → New "Why this grade" section lists the
   engine's own reasoning chain (NOVA class, ceiling, each deduction with its cause).
   Old scans keep working: reasons are stored in the scan's JSON breakdown.

## Issue 2 — report generation latency

Profiled (15-ingredient scan, dev, Groq/Gemini live):

| stage | before | after |
|---|---|---|
| extract (structured path) | 0 ms | 0 ms |
| db lookup | 41–168 | 35–88 |
| scoring | 1–4 | 1–3 |
| explanations (15 LLM calls) | 721–1134 | **deferred post-response** |
| summary + save | 639–2701 | save 5–16 (summary **deleted**) |
| **total to scanId** | **1900–3464 ms** (3rd run: rate-limited failure) | **43–107 ms** |

Changes, in causal order of discovery:

1. **Product summary LLM call deleted.** Its output was returned in JSON but consumed
   nowhere (client only reads `scanId`; `ResultsView` never rendered a summary). One
   wasted LLM call per scan; also fewer rate-limit hits (baseline benchmarking tripped
   Groq's limit after two 15-ingredient scans).
2. **Scoring moved before the LLM stage** — it needs only names+positions (~3 ms).
3. **Progressive results.** Ingredient rows are fully deterministic (KB/DB concern
   levels, normalization) — no LLM needed for the grade, bars, reasons, allergens, or
   the risk-sorted list. The scan is saved with empty explanation paragraphs and
   `scanId` returns in <150 ms. Explanations generate post-response via Next 15
   `after()` and are written to `ScanIngredient` rows; `ResultsView` polls
   `/api/scans/[id]/explanations` (1.5 s interval, 20 tries) and fills paragraphs in,
   shimmer placeholders meanwhile. Verified: shimmer on first paint; all 15 paragraphs
   present ~6 s later; poller stops when `pending: false`.
4. Also fixed in passing: the results page still had the substring user-allergen match
   (word-boundary `allergenPattern` now used everywhere — see
   [[OCR Failure Audit 2026-07-23]]).

End-to-end scan-to-first-report is now dominated entirely by OCR (~3.5–4.5 s);
the analysis phase is effectively instant from the user's perspective.

## Verification
- `validate-scoring.ts` ALL PASS (incl. allergen self-check) · `tsc` clean.
- Browser E2E: results page shows 3 bars (no phantom sugar/sodium), "Why this grade"
  chain summing exactly to the overall score, correct allergens, risk ordering,
  progressive paragraph fill.

## Future levers (not done)
- Cache explanations keyed (ingredient, mode) — repeat ingredients across scans pay
  the LLM cost every time; a table-backed cache would cut deferred work ~80%.
- `after()` on Vercel requires the function to stay warm until completion — monitor;
  if truncation appears, move deferred work to a queue or on-demand generation.
