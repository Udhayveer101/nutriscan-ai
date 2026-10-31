// Server-side cache of the IngredientIndex. The first scan on a server instance loads the
// matching columns of every Ingredient row once (one small query); later scans reuse it
// and only fetch the full rows they actually matched, by primary key.
import type { PrismaClient } from "@prisma/client";
import { IngredientIndex, type IndexRow } from "./ingredient-index";

const TTL_MS = 10 * 60_000; // pick up re-seeds without a redeploy

let cached: { index: IngredientIndex; at: number } | null = null;
let loading: Promise<IngredientIndex> | null = null;

async function load(prisma: PrismaClient): Promise<IngredientIndex> {
  const rows: IndexRow[] = await prisma.ingredient.findMany({
    select: { id: true, slug: true, name: true, aliases: true, eNumber: true },
  });
  const index = new IngredientIndex(rows);
  cached = { index, at: Date.now() };
  return index;
}

export async function getIngredientIndex(prisma: PrismaClient): Promise<IngredientIndex> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.index;
  // Serve the stale index while one refresh runs; only the very first call waits.
  if (!loading) loading = load(prisma).finally(() => { loading = null; });
  if (cached) {
    loading.catch((err) => console.error("ingredient index refresh failed", err));
    return cached.index;
  }
  return loading;
}

/** For tests and the seed script: drop the cached index. */
export function resetIngredientIndex(): void {
  cached = null;
}
