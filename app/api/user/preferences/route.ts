import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allergens, avoidList, preferredMode } = await req.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      allergens: allergens ?? [],
      avoidList: avoidList ?? [],
      preferredMode: preferredMode ?? "BEGINNER",
      onboarded: true,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { allergens: true, avoidList: true, preferredMode: true, onboarded: true },
  });

  return NextResponse.json(user);
}
