import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

const BASE_URL = "https://nutriscan.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ingredients = await prisma.ingredient.findMany({
    select: { slug: true, updatedAt: true },
  });

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
