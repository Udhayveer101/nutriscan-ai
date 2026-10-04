import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ingredientSearchSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = ingredientSearchSchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { q, category, page, limit, sort, order } = parsed.data;
  const skip = (page - 1) * limit;

  // Postgres array `has` is exact and case-sensitive, so try the common casings
  // ("palatinose" should find the alias "Palatinose"). Codes typed as "E 211" or
  // "INS 211" are normalised to the stored "E211" form.
  const aliasForms = q
    ? Array.from(new Set([q, q.toLowerCase(), q.toUpperCase(), q.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())]))
    : [];
  const code = q?.match(/^(?:e|ins)\s*-?\s*(\d{3,4}[a-z]?)$/i);
  const where = {
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { aliases: { hasSome: aliasForms } },
        { eNumber: { contains: code ? `E${code[1]}` : q, mode: "insensitive" as const } },
      ],
    }),
    ...(category && { category: { slug: category } }),
  };

  const [ingredients, total] = await Promise.all([
    prisma.ingredient.findMany({
      where,
      include: { category: true },
      orderBy: { [sort]: order },
      skip,
      take: limit,
    }),
    prisma.ingredient.count({ where }),
  ]);

  return NextResponse.json({
    ingredients,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
