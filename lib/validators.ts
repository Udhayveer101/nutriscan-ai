import { z } from "zod";

export const scanUploadSchema = z.object({
  method: z.enum(["IMAGE", "PASTE", "BARCODE", "CAMERA"]),
  text: z.string().max(10000).optional(),
  barcode: z.string().max(20).optional(),
  mode: z.enum(["BEGINNER", "PARENT", "ATHLETE", "SCIENTIFIC"]).default("BEGINNER"),
});

export const ingredientSearchSchema = z.object({
  q: z.string().max(100).optional().default(""),
  category: z.string().max(50).optional(),
  page: z.coerce.number().int().positive().max(100).default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  sort: z.enum(["name", "safetyScore", "updatedAt"]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export const ingredientAdminSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  aliases: z.array(z.string().max(200)).default([]),
  eNumber: z.string().max(10).optional(),
  categoryId: z.string().cuid(),
  purpose: z.string().min(10).max(2000),
  purposeShort: z.string().min(5).max(200),
  benefits: z.string().min(10).max(2000),
  concerns: z.string().min(10).max(2000),
  sciConsensus: z.string().min(10).max(2000),
  evidenceLevel: z.enum(["STRONG", "MODERATE", "LIMITED", "INSUFFICIENT"]).default("MODERATE"),
  fdaStatus: z.string().max(200),
  efsaStatus: z.string().max(200),
  fssaiStatus: z.string().max(200),
  whoStatus: z.string().max(200),
  safetyScore: z.number().int().min(0).max(100),
  commonProducts: z.array(z.string()).default([]),
  isNatural: z.boolean().default(false),
  isVegan: z.boolean().default(true),
});

export type ScanUploadInput = z.infer<typeof scanUploadSchema>;
export type IngredientSearchInput = z.infer<typeof ingredientSearchSchema>;
export type IngredientAdminInput = z.infer<typeof ingredientAdminSchema>;
