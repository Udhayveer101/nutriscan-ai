import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const ingredient = await prisma.ingredient.findUnique({
    where: { slug },
    include: {
      category: true,
      references: { orderBy: { year: "desc" } },
    },
  });

  if (!ingredient) {
    return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
  }

  return NextResponse.json(ingredient);
}
