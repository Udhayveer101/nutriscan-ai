---
type: methodology
title: Standard Workflow for Adding an Ingredient
last_reviewed: 2026-07-23
---

# Adding an Ingredient — Standard Workflow

Single source of truth is [[Scoring Methodology]]. Every new ingredient passes these
seven gates before it ships. No shortcuts — a DB row without scanner coverage is a bug.

## The seven gates

1. **Scientific research (Joe).** Pull evidence from EFSA / FDA / JECFA-WHO / NIH / IARC and
   peer-reviewed reviews. Capture: function, ADI/limits, regulatory status per body, evidence
   strength, at-risk populations. No blogs or marketing.
2. **Evidence verification (John).** Confirm naming, E-number and taxonomy match existing
   conventions. Where evidence conflicts, state the disagreement and weight the stronger study
   design — don't average.
3. **Structured documentation.** The science lives in `lib/additives.ts` (`AdditiveProfile`).
   The vault page is generated, never hand-written (`npx tsx scripts/gen-vault.ts`).
4. **Fair evaluation.** Score from evidence, not vibes: processing degree, nutrition, function,
   evidence strength, known risks/benefits, regulatory status, long-term impact, consensus.
5. **Confidence assessment.** Set `evidence` to STRONG / MODERATE / LIMITED / INSUFFICIENT to
   reflect *certainty*, not severity. Uncertain science → LIMITED, and say so in `note`.
6. **Database integration.** Add the `prisma/seed.ts` row (its own `safetyScore` + science) AND
   ensure `lookupAdditive` resolves the label text — either a new profile or matched keywords
   on an existing family profile. Sulphite/glutamate/phosphate/alginate families share one KB
   profile by design.
7. **Scanner verification.** Run `lookupAdditive("<name>")` and `lookupAdditive("<E-number>")`;
   confirm the expected id. Then `validate-scoring.ts` (green) + `tsc --noEmit` (clean).

## Critic pass (Joe Doe) — reject if any is true

- Missing/weak evidence, or a blog/marketing source.
- Duplicate substance already in seed or KB (check the substance, not just the slug).
- Inconsistent naming or wrong E-number.
- Wrong category, or a dual-function additive added twice.
- Score not defensible from the cited evidence.
- Greedy-keyword shadowing (a generic substring hijacking a specific name — see below).

## Keyword-matching rules (learned the hard way)

`lookupAdditive` now prefers the **longest matching keyword** (most specific wins), so a
generic substring like `sorbate`/`glycerol` can't shadow `polysorbate`/`polyglycerol`.
Still: prefer full multi-word keywords, and when adding a family member, extend the family
profile's keywords rather than pasting a duplicate keyword onto two profiles.

## Commands (from `CLAUDE.md`)

```
npx tsx scripts/validate-scoring.ts   # must stay green
npx tsx scripts/gen-vault.ts          # regenerate vault pages
npx tsc --noEmit                      # clean
graphify . --update                   # refresh the graph
```

## Sup sign-off

One category at a time. Joe → John → Joe Doe → integrate → verify → Sup confirms → next.
See [[Expansion Roadmap]] for the 2026-07 category expansion that established this process.
