// All Ingredient seed rows. Expansion batches are appended to BATCHES in order.
import { INGREDIENTS, MORE_INGREDIENTS } from "./core";
import type { SeedIngredient } from "./types";
import { BATCH_01 } from "./batch-01";
import { BATCH_02 } from "./batch-02";
import { BATCH_03 } from "./batch-03";
import { BATCH_04 } from "./batch-04";

const BATCHES: SeedIngredient[][] = [
  BATCH_01,
  BATCH_02,
  BATCH_03,
  BATCH_04,
];

export const CORE_INGREDIENTS: SeedIngredient[] = [...INGREDIENTS, ...MORE_INGREDIENTS].map((r) => ({
  ...r,
  eNumber: r.eNumber || null,
  adiValue: r.adiValue ?? null,
}));
export const EXPANSION_INGREDIENTS: SeedIngredient[] = BATCHES.flat();
export const ALL_INGREDIENTS: SeedIngredient[] = [...CORE_INGREDIENTS, ...EXPANSION_INGREDIENTS];
