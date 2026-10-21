import { PrismaClient } from "@prisma/client";
import { ALL_INGREDIENTS } from "./ingredients";
import { CATEGORIES } from "./ingredients/categories";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding comprehensive ingredient database...");

  // Upsert categories
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const result = await prisma.ingredientCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = result.id;
  }
  console.log(`✓ ${CATEGORIES.length} categories`);

  // Upsert ingredients (and their research references) in small parallel chunks,
  // so ~2,000 rows stay quick against a remote database during Vercel builds.
  let count = 0;
  let refCount = 0;
  const CHUNK = 20;
  for (let i = 0; i < ALL_INGREDIENTS.length; i += CHUNK) {
    await Promise.all(ALL_INGREDIENTS.slice(i, i + CHUNK).map(async (ing) => {
      const { categorySlug, refs, ...data } = ing;
      const categoryId = categoryMap[categorySlug];
      if (!categoryId) { console.warn(`⚠ No category for ${ing.name}`); return; }

      const row = await prisma.ingredient.upsert({
        where: { slug: data.slug },
        update: { ...data, categoryId },
        create: { ...data, categoryId },
      });
      count++;
      if (refs?.length) {
        await prisma.$transaction([
          prisma.researchReference.deleteMany({ where: { ingredientId: row.id } }),
          prisma.researchReference.createMany({ data: refs.map((r) => ({ ...r, ingredientId: row.id })) }),
        ]);
        refCount += refs.length;
      }
    }));
  }

  console.log(`✓ ${count} ingredients seeded, ${refCount} research references`);
  console.log("✅ Done");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
