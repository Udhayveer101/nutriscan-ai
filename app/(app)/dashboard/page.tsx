import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Scan, Leaf, Clock, ChevronRight, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

const GRADE_COLORS: Record<string, string> = {
  A_PLUS: "#34c759", A: "#34c759", B: "#30b0c7", C: "#ff9f0a", D: "#ff6b35", F: "#ff3b30",
};
const GRADE_LABELS: Record<string, string> = {
  A_PLUS: "A+", A: "A", B: "B", C: "C", D: "D", F: "F",
};

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
    <div className="min-h-screen pb-tab-bar md:pb-16" style={{ background: "var(--ios-bg)" }}>
      <div className="max-w-2xl mx-auto px-4 pt-14 md:pt-20">

        {/* Profile header */}
        <div className="ios-card p-6 mt-6 mb-4">
          <div className="flex items-center gap-4">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User"}
                width={64}
                height={64}
                className="rounded-full ring-2 ring-green-700/10"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                style={{ background: "var(--ios-tint)" }}
              >
                {session.user?.name?.[0] ?? "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-[20px] font-bold text-gray-900 truncate">
                {session.user.name ?? "Your Profile"}
              </h1>
              <p className="text-[13px] truncate" style={{ color: "var(--ios-label2)" }}>
                {session.user.email}
              </p>
            </div>
          </div>

          {scans.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5" style={{ borderTop: "0.5px solid var(--ios-separator)" }}>
              <div className="text-center">
                <p className="text-[24px] font-bold text-gray-900">{scans.length}</p>
                <p className="text-[11px] font-medium" style={{ color: "var(--ios-label2)" }}>Scans</p>
              </div>
              <div className="text-center">
                <p className="text-[24px] font-bold" style={{ color: "var(--ios-tint)" }}>{avgScore}</p>
                <p className="text-[11px] font-medium" style={{ color: "var(--ios-label2)" }}>Avg Score</p>
              </div>
              <div className="text-center">
                <p className="text-[24px] font-bold text-gray-900">{bookmarks.length}</p>
                <p className="text-[11px] font-medium" style={{ color: "var(--ios-label2)" }}>Saved</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick action */}
        <Link
          href="/scan"
          className="flex items-center gap-4 p-4 mb-4 rounded-2xl text-white transition-all active:scale-[0.98]"
          style={{ background: "var(--ios-tint)", boxShadow: "0 2px 12px rgba(26,92,42,0.25)" }}
        >
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Scan className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[15px]">Scan a new product</p>
            <p className="text-[12px] text-white/70">Analyse ingredients instantly</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/60" />
        </Link>

        {/* Recent scans */}
        <div className="mb-4">
          <p className="ios-section-title mb-2">Recent Scans</p>
          {scans.length === 0 ? (
            <div className="ios-card p-10 text-center">
              <Scan className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--ios-label3)" }} strokeWidth={1.5} />
              <p className="font-medium text-gray-900">No scans yet</p>
              <p className="text-[13px] mt-1" style={{ color: "var(--ios-label2)" }}>
                Scan your first product to get started
              </p>
            </div>
          ) : (
            <div className="ios-row-group">
              {scans.slice(0, 10).map((scan) => {
                const gradeColor = GRADE_COLORS[scan.grade] ?? "#8e8e93";
                const gradeLabel = GRADE_LABELS[scan.grade] ?? "?";
                return (
                  <Link
                    key={scan.id}
                    href={`/scan/results/${scan.id}`}
                    className="ios-row group hover:bg-gray-50"
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-[15px] text-white flex-shrink-0"
                      style={{ background: gradeColor }}
                    >
                      {gradeLabel}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] text-gray-900 truncate">
                        {scan.productName ?? "Scanned Product"}
                      </p>
                      <p className="text-[12px] flex items-center gap-1.5 mt-0.5" style={{ color: "var(--ios-label2)" }}>
                        <Clock className="w-3 h-3" />
                        {new Date(scan.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        <span>·</span>
                        <span>{scan._count.ingredients} ingredients</span>
                        <span>·</span>
                        <span>{scan.overallScore}/100</span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--ios-label3)" }} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Saved ingredients */}
        {bookmarks.length > 0 && (
          <div className="mb-4">
            <p className="ios-section-title mb-2">Saved Ingredients</p>
            <div className="ios-row-group">
              {bookmarks.map((b) =>
                b.ingredient ? (
                  <Link
                    key={b.id}
                    href={`/ingredients/${b.ingredient.slug}`}
                    className="ios-row group hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                      {b.ingredient.category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] text-gray-900 truncate">{b.ingredient.name}</p>
                      <p className="text-[12px]" style={{ color: "var(--ios-label2)" }}>{b.ingredient.category.name}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--ios-label3)" }} />
                  </Link>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Account links */}
        <div className="mb-8">
          <p className="ios-section-title mb-2">Explore</p>
          <div className="ios-row-group">
            <Link href="/ingredients" className="ios-row hover:bg-gray-50">
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4 text-green-700" />
              </div>
              <span className="flex-1 text-[15px] font-medium text-gray-900">Ingredient Database</span>
              <ChevronRight className="w-4 h-4" style={{ color: "var(--ios-label3)" }} />
            </Link>
            <Link href="/learn" className="ios-row hover:bg-gray-50" style={{ borderBottom: "none" }}>
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-blue-700" />
              </div>
              <span className="flex-1 text-[15px] font-medium text-gray-900">Learn About Food</span>
              <ChevronRight className="w-4 h-4" style={{ color: "var(--ios-label3)" }} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
