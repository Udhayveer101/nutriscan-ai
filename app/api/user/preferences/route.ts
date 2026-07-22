import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userPreferencesSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = userPreferencesSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid preferences", details: parsed.error.flatten() }, { status: 400 });
  }
  const { allergens, avoidList, preferredMode } = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { allergens, avoidList, preferredMode, onboarded: true },
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
