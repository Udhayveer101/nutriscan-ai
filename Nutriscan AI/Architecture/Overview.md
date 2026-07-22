---
type: architecture
last_reviewed: 2026-07-23
---

# NutriScan AI — Architecture Overview

Next.js 15 (App Router, React 19) + Prisma/PostgreSQL. Scans a food label (image OCR,
pasted text, or barcode) → extracts ingredients → **explainable evidence-based score** →
personalised results. This vault is the navigation system — read it before the source
(see [[../CLAUDE|CLAUDE.md]] lookup order).

## Request flows

### Scan → score (core path)
1. **Image** → `POST /api/scan/upload` → `lib/vision.ts` (Gemini → Groq fallback OCR).
2. **Analyse** → `POST /api/analysis` → `lib/gemini.ts` extracts/normalises names →
   Prisma lookup → `lib/scoring.ts` [[../Methodology/Scoring Methodology|scores]] →
   persists a `Scan` → returns breakdown + per-ingredient reasons + interactions.
3. **Barcode** → `GET /api/scan/barcode` → `lib/barcode.ts` (Open Food Facts).

### Auth
NextAuth v5 + Prisma adapter, Google provider only (`lib/auth.ts`). Session carries
`user.id` and `user.role`. Database-session strategy. No middleware — routes guard
themselves with `auth()`.

## Module map
| Concern | Files |
|---|---|
| Scoring engine | `lib/scoring.ts`, `lib/additives.ts`, `lib/interactions.ts` |
| AI / OCR | `lib/vision.ts`, `lib/gemini.ts` |
| External data | `lib/barcode.ts` (Open Food Facts) |
| Data access | `lib/prisma.ts`, `prisma/schema.prisma`, `prisma/seed.ts` |
| Validation | `lib/validators.ts` (zod) |
| Security | `lib/ratelimit.ts`, `next.config.ts` headers |
| API | `app/api/{analysis,scan/*,ingredients/*,user/preferences,auth}` |
| UI | `app/(app)/*`, `app/(marketing)/*`, `components/*` |

## Data model (Prisma)
`User`→`Scan`→`ScanIngredient`→`Ingredient`→`IngredientCategory`; `ResearchReference`,
`Bookmark`, `SearchHistory`, `Article`. Auth: `Account`/`Session`/`VerificationToken`.
Canonical seed: `prisma/seed.ts` (158 curated ingredients). The KB in `lib/additives.ts`
is the scientific scoring overlay (63 profiles), rendered to [[../Ingredients/_index]].

## External integrations
Google OAuth · Groq (Llama 3.3) text + vision · Gemini 2.5 Flash OCR · Open Food Facts.

## State & caching
Client state: Zustand + React Server Components. Barcode lookups cached 24h via
`next: { revalidate: 86400 }`. Ingredient GET is uncached (small dataset). No Redis.

## Deployment
Vercel (`vercel.json` framework preset). Build: `prisma generate && next build`.
Env: `DATABASE_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, `GROQ_API_KEY`,
`GEMINI_API_KEY`. Server-action origin allowlist in `next.config.ts`.
