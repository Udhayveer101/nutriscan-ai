// Row builders: shared defaults per ingredient family, overridden per row.
import type { SeedIngredient } from "./types";

type Required = Pick<SeedIngredient, "slug" | "name" | "aliases" | "purposeShort" | "purpose" | "benefits" | "concerns" | "safetyScore" | "commonProducts">;

// Fields given in `defaults` become optional on each row.
export const family = <D extends Partial<SeedIngredient>>(defaults: D) =>
  (r: Omit<Required, keyof D> & Partial<SeedIngredient>): SeedIngredient => ({
    eNumber: null, adiValue: null, isNatural: true, isVegan: true,
    ...defaults, ...r,
    refs: [...(defaults.refs ?? []), ...(r.refs ?? [])],
  }) as SeedIngredient;
