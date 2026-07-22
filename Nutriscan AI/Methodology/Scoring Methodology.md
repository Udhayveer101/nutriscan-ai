---
type: methodology
last_reviewed: 2026-07-23
implements: lib/scoring.ts
---

# Scoring Methodology

The engine scores a product **from first principles**, not by tweaking arbitrary weights.
The design goal: every score is explainable, evidence-based, and reproducible, and the
methodology *naturally* produces sensible results (an ultra-processed snack cannot score
like a whole food, without anyone manually lowering it).

## Why the old model was replaced

The previous model started every product at a high base (~65) and subtracted small,
position-decayed penalties. Because label lists are short and penalties decayed with
position, ultra-processed foods (e.g. Lay's) landed in A/B territory. Two structural
leaks: (1) no processing ceiling, (2) sugar/sodium defaulted to 100 when nutrition data
was absent, gifting ~20% of the score for free.

## The pipeline (`lib/scoring.ts`)

1. **Per-ingredient assessment** — each name is matched against the cited knowledge base
   (`lib/additives.ts`), bulk rules (salt/sugar/oil/refined flour), or whole-food markers.
   Concern is concentration-sensitive: dominant (pos 0–2) / moderate (3–6) / trace (7+).

2. **NOVA processing classification** — the single most important anti-inflation lever.
   Sets a hard **ceiling** on the score:
   | NOVA group | Meaning | Ceiling |
   |---|---|---|
   | 1 | Unprocessed / minimally processed | 100 |
   | 2 | Processed culinary ingredients | 85 |
   | 3 | Processed (refined oil, added salt/sugar, or 1 additive) | 60 |
   | 4 | Ultra-processed (≥2 additives, cosmetic markers, or dominant added sugar) | 40 |

3. **Composition quality** — position-weighted concern → 0–100.
4. **Additive burden** — count × severity of flagged additives → 0–100.
5. **Processing score** — derived transparently from the NOVA group.
6. **Composite** — `quality·0.34 + additive·0.24 + processing·0.22 (+ sugar·0.10 + sodium·0.10)`.
   When no nutrition data is supplied, the sugar/sodium weight is **redistributed**, never
   credited at 100.
7. **NOVA ceiling applied.**
8. **Post-ceiling separation** — HIGH-concern and cosmetic additives (dyes/sweeteners)
   keep subtracting after the cap, so a dye-laden cereal ranks below a cleaner NOVA-4 food.
9. **CRITICAL cap (25)** — any banned/carcinogenic additive forces the score into F/D.
10. **Interactions** — documented combination risks subtract (see [[Interaction Analysis]]).
11. **Confidence** — derived from the evidence level behind the worst concern
    (high / moderate / low).

## Grade bands
A+ ≥90 · A ≥78 · B ≥65 · C ≥50 · D ≥35 · F <35

## Validation
`scripts/validate-scoring.ts` asserts 12 real-product archetypes land in scientifically
defensible bands (Lay's → C, Coke → F, plain oats → A+). Any methodology change must keep
this green — the guarantee is that sensible results emerge from the model, not from manual
score edits.
