import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

// Render on request (revalidated hourly), not at build — the sitemap must never be a
// build-time DB dependency, and a DB blip must degrade to the static pages, not 500.
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let ingredients: { slug: string; updatedAt: Date }[] = [];
  try {
    ingredients = await prisma.ingredient.findMany({
      select: { slug: true, updatedAt: true },
    });
  } catch (err) {
    console.error("[sitemap] ingredient query failed, serving static pages only:", err);
  }

  const ingredientUrls = ingredients.map((ing) => ({
    url: `${BASE_URL}/ingredients/${ing.slug}`,
    lastModified: ing.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticPages = [
    { url: BASE_URL, priority: 1.0 },
    { url: `${BASE_URL}/scan`, priority: 0.9 },
    { url: `${BASE_URL}/ingredients`, priority: 0.9 },
    { url: `${BASE_URL}/features`, priority: 0.7 },
    { url: `${BASE_URL}/learn`, priority: 0.7 },
    { url: `${BASE_URL}/about`, priority: 0.6 },
  ].map((p) => ({
    ...p,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...ingredientUrls];
}
