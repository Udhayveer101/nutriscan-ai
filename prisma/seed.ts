import { PrismaClient } from "@prisma/client";
import { ALL_INGREDIENTS } from "./ingredients";
import { CATEGORIES } from "./ingredients/categories";
import { MERGED } from "./ingredients/codes";

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

  // Rows merged into another (codes.ts MERGED): move scan and bookmark links to the
  // keeper, then delete the duplicate so the scanner index never sees it.
  let merged = 0;
  for (const [drop, keep] of Object.entries(MERGED)) {
    const [old, target] = await Promise.all([
      prisma.ingredient.findUnique({ where: { slug: drop }, select: { id: true } }),
      prisma.ingredient.findUnique({ where: { slug: keep }, select: { id: true } }),
    ]);
    if (!old || !target) continue;
    await prisma.$transaction([
      prisma.scanIngredient.updateMany({ where: { ingredientId: old.id }, data: { ingredientId: target.id } }),
      // A user who bookmarked both keeps one bookmark.
      prisma.bookmark.deleteMany({ where: { ingredientId: old.id, user: { bookmarks: { some: { ingredientId: target.id } } } } }),
      prisma.bookmark.updateMany({ where: { ingredientId: old.id }, data: { ingredientId: target.id } }),
      prisma.ingredient.delete({ where: { id: old.id } }),
    ]);
    merged++;
  }
  if (merged) console.log(`✓ ${merged} duplicate ingredient(s) merged`);
  console.log("✅ Done");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
