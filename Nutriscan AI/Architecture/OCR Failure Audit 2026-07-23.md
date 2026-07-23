---
type: audit
date: 2026-07-23
scope: "reported OCR failure — root cause + full feature re-verification"
---

# OCR Failure Audit — 2026-07-23

Reported: "OCR is not functioning correctly." Audited before fixing; every claim below
was reproduced or verified live against the dev server, not assumed.

## Root cause: not OCR at all

**The OCR/analysis backend was fully healthy.** Verified with evidence at every stage:

| stage | evidence |
|---|---|
| OCR upload endpoint | `curl` with synthetic 900×300 label PNG → 200, correct structured contract (`ingredients[9]`, gemini, pass 1, conf 0.95), allergen statement correctly excluded |
| Client downscale (Stage 0) | 3000×1000 injected file → downscaled, uploaded, extracted correctly |
| Structured contract (Stage 6) | `/api/analysis` with `ingredients[]` → `extract: 0 ms` (re-extraction skipped) |
| Scoring / DB / report | timings healthy (total ~1.0–1.5 s), results page renders |

**The actual defect:** `ScannerInterface.handleAnalyze` awaited
`requestAnimationFrame` before starting the analysis fetch. RAF **never fires in a
non-painting tab** (backgrounded, minimized, throttled mobile webview). Result: spinner
shows, no request is ever sent, the scan hangs forever — presents exactly as "scanning
/ OCR is broken." Predates the pipeline-optimization commit (it shipped with the
"paint the loading state first" micro-optimization).

- Evidence: in a non-painting pane, RAF raced against a 2 s timeout → timeout won;
  server logs showed **zero** `/api/analysis` requests while the UI spun. Direct
  `fetch` from the same page → 200 in ~1 s.
- Fix: deleted the RAF await (a paint yield must never gate a network request; React
  paints the loading state while the fetch is in flight).
- Regression test: the same dead-RAF pane now completes upload → analysis → results.

## Second defect found during verification: allergen false positives

Results showed **"Allergen Alert: Gluten / Wheat via Sodium Benzoate."**
`detectAllergens` used substring matching: keyword `oat` matched "sodium benz**oat**e"
(same class: `malt` ⊂ "maltodextrin", `fish` ⊂ "kingfisher"). Safety-critical surface —
false allergen warnings destroy trust in the one feature allergy users depend on.

- Fix: word-boundary regex with optional plural (`\b(keyword)s?\b`) via exported
  `allergenPattern` in `lib/scoring.ts`; also applied to user allergen/avoid-list
  matching in `/api/analysis` (same substring bug: user allergen "oat" would have
  flagged benzoate).
- Guardrail: allergen self-check added to `scripts/validate-scoring.ts`
  (false-positive set must match 0; true-positive set must match wheat/dairy/soy).

## Feature re-verification (previous requests)

| requirement | status | evidence |
|---|---|---|
| Staged OCR pipeline (gate, fallback, structuring, sanitize, structured response) | Working | curl + UI runs above; `passesUsed`/`enhancedUsed` in response |
| Structured output consumed downstream | Working | `extract: 0 ms` on image path |
| Reduced analysis text | Working | 1–2 sentence explanations rendered |
| Risk-ordered ingredients | Working | HIGH → MODERATE → LOW order on results page |
| Faster reports | Working | ~1.0–1.5 s total, timings logged per stage |
| Scoring engine + KB | Working | `validate-scoring.ts` ALL PASS (now incl. allergen check) |
| Stage 0 camera UX / Stage 3 enhanced retry | Still deferred (unchanged, documented in [[Scan Pipeline Optimization 2026-07-23]]) | — |

Known non-defect observation: positional concern brackets mean a dye like Red 40 at a
trace position displays LOW concern while still penalising the overall score — this is
documented KB methodology (dose/position sensitivity), not a regression.
