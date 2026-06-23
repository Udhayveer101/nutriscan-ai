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

  const where = {
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { aliases: { has: q } },
        { eNumber: { contains: q, mode: "insensitive" as const } },
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
