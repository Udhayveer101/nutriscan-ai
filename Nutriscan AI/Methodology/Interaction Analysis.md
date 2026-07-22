---
type: methodology
last_reviewed: 2026-07-23
implements: lib/interactions.ts
---

# Interaction Analysis

Some risks appear only from **combinations** of ingredients and are invisible when each is
scored alone. The engine detects a conservative set of scientifically documented
interactions (`lib/interactions.ts`); a rule fires only when *every* required ingredient
group is present on the label. We do not infer interactions without strong support.

## Documented interactions

### Benzene formation (benzoate + vitamin C) — HIGH, −20
Benzoate preservatives react with ascorbic acid in acidic drinks to form benzene, a known
carcinogen; worsened by heat and light during storage.
*Ref: FDA "Data on Benzene in Soft Drinks"; Gardner & Lawrence 1993.*

### Nitrosamine formation (nitrite + protein/amines) — HIGH, −18
Nitrite curing salts combine with amines in protein-rich meats under heat to form
nitrosamines. This is the mechanism behind processed meat being a WHO Group 1 carcinogen.
*Ref: IARC 2015; EFSA 2017.*

### Additive hyperactivity mixture (dyes + benzoate) — MEDIUM, −12
The Southampton study tested synthetic colour dyes *together with* sodium benzoate and
found increased hyperactivity in children — the mixture was the tested exposure.
*Ref: McCann et al. 2007 (The Lancet).*

### Bone-mineral concern (phosphoric acid + caffeine) — MEDIUM, −6
Colas pair phosphoric acid with caffeine; high intake is associated with reduced bone
mineral density.
*Ref: Tucker et al. 2006 (Am J Clin Nutr).*

## Adding an interaction
Add a rule to `INTERACTIONS` in `lib/interactions.ts` with its trigger groups, penalty,
severity, evidence level, plain-language explanation, and a reference. Then re-run
`scripts/validate-scoring.ts`. The self-check in that file guards against false positives.
