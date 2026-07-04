import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Scan, Leaf, ChevronRight, Star, SlidersHorizontal, RefreshCw, LogOut } from "lucide-react";
import { GradeBadge } from "@/components/ui/GradeBadge";
import type { Grade } from "@/lib/grade";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const [scans, bookmarks] = await Promise.all([
    prisma.scan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { _count: { select: { ingredients: true } } },
    }),
    prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: { ingredient: { include: { category: true } } },
      take: 8,
    }),
  ]);

  const avgScore = scans.length
    ? Math.round(scans.reduce((s, sc) => s + sc.overallScore, 0) / scans.length)
    : null;

  return (
    <div
      className="min-h-screen pb-tab-bar md:pb-16"
      style={{ background: "radial-gradient(110% 40% at 50% -8%, #e9f5ec 0%, #f6f5f1 46%, #f6f5f1 100%)" }}
    >
      <div className="max-w-[760px] mx-auto px-5 md:px-10 pt-28 md:pt-32 pb-14 flex flex-col gap-[18px]">

        {/* Profile + stats */}
        <div className="glass rounded-[20px] p-6">
          <div className="flex items-center gap-4">
            {session.user?.image ? (
              <Image src={session.user.image} alt={session.user.name ?? "User"} width={64} height={64} className="rounded-full flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0" style={{ background: "var(--brand-800)" }}>
                {session.user?.name?.[0] ?? "U"}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-heading font-extrabold text-[24px] tracking-[-.02em] truncate" style={{ color: "var(--ink)" }}>
                {session.user.name ?? "Your Profile"}
              </h1>
              <p className="text-[14px] truncate" style={{ color: "var(--muted-3)" }}>{session.user.email}</p>
            </div>
          </div>

          {scans.length > 0 && (
            <>
              <div className="h-px my-5" style={{ background: "var(--separator)" }} />
              <div className="grid grid-cols-3 text-center">
                <div>
                  <div className="font-heading font-extrabold text-[30px]" style={{ color: "var(--ink)" }}>{scans.length}</div>
                  <div className="font-mono-label text-[10px] tracking-[.1em] mt-0.5" style={{ color: "var(--muted-4)" }}>SCANS</div>
                </div>
                <div style={{ borderLeft: "1px solid var(--separator)", borderRight: "1px solid var(--separator)" }}>
                  <div className="font-heading font-extrabold text-[30px]" style={{ color: "var(--brand-600)" }}>{avgScore}</div>
                  <div className="font-mono-label text-[10px] tracking-[.1em] mt-0.5" style={{ color: "var(--muted-4)" }}>AVG SCORE</div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-[30px]" style={{ color: "var(--ink)" }}>{bookmarks.length}</div>
                  <div className="font-mono-label text-[10px] tracking-[.1em] mt-0.5" style={{ color: "var(--muted-4)" }}>SAVED</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Scan CTA */}
        <Link
          href="/scan"
          className="relative rounded-[18px] overflow-hidden flex items-center gap-4 px-6 py-[22px] transition-transform hover:-translate-y-0.5"
          style={{ background: "linear-gradient(150deg,#1a7a3e,#0d4c26)", boxShadow: "0 16px 40px -14px rgba(15,82,40,.6)" }}
        >
          <div className="absolute w-[200px] h-[200px] rounded-full pointer-events-none animate-drift" style={{ background: "radial-gradient(circle, rgba(74,222,128,.28), transparent 70%)", top: -100, right: -30 }} />
          <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white text-[22px] flex-shrink-0" style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)" }}>
            <Scan className="w-5 h-5" />
          </div>
          <div className="relative flex-1">
            <div className="font-heading font-bold text-[18px] text-white">Scan a new product</div>
            <div className="text-[13px]" style={{ color: "#bfe3cd" }}>Analyse a label instantly — free, no signup.</div>
          </div>
          <ChevronRight className="relative w-5 h-5 text-white" />
        </Link>

        {/* Recent scans */}
        <div>
          <div className="font-mono-label font-bold text-[11px] tracking-[.14em] mx-0.5 my-2.5 mb-3" style={{ color: "var(--muted-2)" }}>RECENT SCANS</div>
          {scans.length === 0 ? (
            <div className="glass rounded-[18px] p-10 text-center">
              <Scan className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--muted-4)" }} strokeWidth={1.5} />
              <p className="font-heading font-bold" style={{ color: "var(--ink-2)" }}>No scans yet</p>
              <p className="text-[13px] mt-1" style={{ color: "var(--muted-2)" }}>Scan your first product to get started</p>
            </div>
          ) : (
            <div className="glass rounded-[18px] overflow-hidden">
              {scans.slice(0, 10).map((scan) => (
                <Link
                  key={scan.id}
                  href={`/scan/results/${scan.id}`}
                  className="flex items-center gap-3.5 px-[18px] py-4 transition-colors hover:bg-black/[.02]"
                  style={{ borderBottom: "1px solid rgba(20,70,45,.07)" }}
                >
                  <GradeBadge grade={scan.grade as Grade} />
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-bold text-[15px] truncate" style={{ color: "var(--ink-2)" }}>{scan.productName ?? "Scanned Product"}</div>
                    <div className="font-mono-label text-[11px] mt-0.5" style={{ color: "var(--muted-4)" }}>
                      {new Date(scan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()} · {scan._count.ingredients} INGREDIENTS · {scan.overallScore}/100
                    </div>
                  </div>
                  <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "var(--muted-4)" }} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Saved ingredients */}
        {bookmarks.length > 0 && (
          <div>
            <div className="font-mono-label font-bold text-[11px] tracking-[.14em] mx-0.5 my-2.5 mb-3" style={{ color: "var(--muted-2)" }}>SAVED INGREDIENTS</div>
            <div className="glass rounded-[18px] overflow-hidden">
              {bookmarks.map((b) =>
                b.ingredient ? (
                  <Link
                    key={b.id}
                    href={`/ingredients/${b.ingredient.slug}`}
                    className="flex items-center gap-3.5 px-[18px] py-4 transition-colors hover:bg-black/[.02]"
                    style={{ borderBottom: "1px solid rgba(20,70,45,.07)" }}
                  >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: "rgba(20,70,45,.06)" }}>
                      {b.ingredient.category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-heading font-bold text-[15px] truncate" style={{ color: "var(--ink-2)" }}>{b.ingredient.name}</div>
                      <div className="text-[12px]" style={{ color: "var(--muted-3)" }}>{b.ingredient.category.name}</div>
                    </div>
                    <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "var(--muted-4)" }} />
                  </Link>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Explore */}
        <div>
          <div className="font-mono-label font-bold text-[11px] tracking-[.14em] mx-0.5 my-2.5 mb-3" style={{ color: "var(--muted-2)" }}>EXPLORE</div>
          <div className="flex flex-col gap-3">
            <Link href="/ingredients" className="glass rounded-2xl px-[18px] py-4 flex items-center gap-3.5 transition-transform hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#dcfce7", color: "#15803d" }}>
                <Leaf className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1">
                <div className="font-heading font-bold text-[15px]" style={{ color: "var(--ink-2)" }}>Ingredient Database</div>
                <div className="text-[12px]" style={{ color: "var(--muted-2)" }}>Look up any additive by name or E-number.</div>
              </div>
              <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "var(--muted-4)" }} />
            </Link>
            <Link href="/learn" className="glass rounded-2xl px-[18px] py-4 flex items-center gap-3.5 transition-transform hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#dbeafe", color: "#1e40af" }}>
                <Star className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1">
                <div className="font-heading font-bold text-[15px]" style={{ color: "var(--ink-2)" }}>Learn About Food</div>
                <div className="text-[12px]" style={{ color: "var(--muted-2)" }}>Evidence-based reads on labels and nutrition.</div>
              </div>
              <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "var(--muted-4)" }} />
            </Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <div className="font-mono-label font-bold text-[11px] tracking-[.14em] mx-0.5 my-2.5 mb-3" style={{ color: "var(--muted-2)" }}>ACCOUNT</div>
          <div className="glass rounded-[18px] overflow-hidden">
            <Link href="/onboarding?edit=1" className="flex items-center gap-3.5 px-[18px] py-4 transition-colors hover:bg-black/[.02]" style={{ borderBottom: "1px solid rgba(20,70,45,.07)" }}>
              <SlidersHorizontal className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "var(--ink-3)" }} />
              <span className="flex-1 font-semibold text-[15px]" style={{ color: "var(--ink-2)" }}>Edit preferences</span>
              <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "var(--muted-4)" }} />
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/auth/signin" });
              }}
            >
              <button type="submit" className="w-full flex items-center gap-3.5 px-[18px] py-4 text-left transition-colors hover:bg-black/[.02]" style={{ borderBottom: "1px solid rgba(20,70,45,.07)" }}>
                <RefreshCw className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "var(--ink-3)" }} />
                <span className="flex-1 font-semibold text-[15px]" style={{ color: "var(--ink-2)" }}>Switch account</span>
                <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "var(--muted-4)" }} />
              </button>
            </form>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="w-full flex items-center gap-3.5 px-[18px] py-4 text-left transition-colors hover:bg-red-50">
                <LogOut className="w-[18px] h-[18px] flex-shrink-0 text-red-600" />
                <span className="flex-1 font-semibold text-[15px] text-red-600">Sign out</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
