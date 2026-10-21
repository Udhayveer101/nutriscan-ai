// All Ingredient seed rows. Expansion batches are appended to BATCHES in order.
import { INGREDIENTS, MORE_INGREDIENTS } from "./core";
import type { SeedIngredient } from "./types";

const BATCHES: SeedIngredient[][] = [
];

export const CORE_INGREDIENTS: SeedIngredient[] = [...INGREDIENTS, ...MORE_INGREDIENTS].map((r) => ({
  ...r,
  eNumber: r.eNumber || null,
  adiValue: r.adiValue ?? null,
}));
export const EXPANSION_INGREDIENTS: SeedIngredient[] = BATCHES.flat();
export const ALL_INGREDIENTS: SeedIngredient[] = [...CORE_INGREDIENTS, ...EXPANSION_INGREDIENTS];
