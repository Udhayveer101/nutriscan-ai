import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Progressive results: the results page polls this until every ingredient's
// deferred AI explanation has been written by the analysis route's after() task.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Anonymous scans are a product feature, so the cuid is the only credential they have and
  // that is by design. A scan that belongs to an account is different: it is that person's
  // history, so it is only readable by them. Without this, a scan id that leaks anywhere —
  // a shared link, a referrer, a log line — hands over someone's saved scan.
  const scan = await prisma.scan.findUnique({ where: { id }, select: { userId: true } });
  if (!scan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (scan.userId) {
    const session = await auth();
    if (session?.user?.id !== scan.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

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
