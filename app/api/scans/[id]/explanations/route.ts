import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Progressive results: the results page polls this until every ingredient's
// deferred AI explanation has been written by the analysis route's after() task.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await prisma.scanIngredient.findMany({
    where: { scanId: id },
    select: { id: true, aiExplanation: true },
  });
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    pending: rows.some((r) => !r.aiExplanation),
    explanations: rows.filter((r) => r.aiExplanation),
  });
}
