# NutriScan AI

Next.js + Prisma/Postgres food-label scanner. OCR (Groq/Llama vision) → ingredient
extraction → **evidence-based scoring** → explainable results.

## Token-efficient navigation (FleetCare pattern)

Answer questions in this order — cheapest first, source last:

1. **Vault first** — `Nutriscan AI/` is the rendered knowledge base. Ingredient science →
   `Ingredients/`. Scoring/interaction design → `Methodology/`.
2. **Graphify query second** — `graphify-out/graph.json` exists. For "how does X work / what
   calls Y" run `graphify query "..."` instead of grepping.
3. **Source last** — only open `lib/*.ts` when 1 & 2 don't answer it.

## Scoring — single source of truth

- **`lib/additives.ts`** — the cited additive knowledge base. Add/adjust ingredient science
  HERE, then run `npx tsx scripts/gen-vault.ts` to regenerate vault pages. Never hand-edit
  `Nutriscan AI/Ingredients/*.md`.
- **`lib/interactions.ts`** — documented combination risks (benzene, nitrosamines, …).
- **`lib/scoring.ts`** — the NOVA-anchored engine. See `Methodology/Scoring Methodology.md`.
- **`scripts/validate-scoring.ts`** — real-product guardrail. **Run it after ANY scoring or
  knowledge-base change; it must stay green.** Fix the methodology, never manually nudge a
  product's score.

## After changing scoring or the knowledge base
1. `npx tsx scripts/validate-scoring.ts` (must pass)
2. `npx tsx scripts/gen-vault.ts` (if additives/interactions changed)
3. `npx tsc --noEmit`
4. `graphify . --update` to refresh the graph
