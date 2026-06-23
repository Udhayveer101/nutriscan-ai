import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Scan, Leaf, Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const [scans, bookmarks] = await Promise.all([
    prisma.scan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { _count: { select: { ingredients: true } } },
    }),
    prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: { ingredient: { include: { category: true } } },
      take: 8,
    }),
  ]);

  const gradeLabel = (grade: string) =>
    ({ A_PLUS: "A+", A: "A", B: "B", C: "C", D: "D", F: "F" }[grade] ?? "B");

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-navy-900">
            Welcome back, {session.user.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-gray-500 mt-1">Your scan history and saved ingredients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scan history */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Scan className="w-4 h-4 text-green-700" />
              Recent Scans
            </h2>
            {scans.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <Scan className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No scans yet</p>
                <Link href="/scan" className="btn-primary mt-4 mx-auto">
                  Scan your first product
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {scans.map((scan) => (
                  <Link
                    key={scan.id}
                    href={`/scan/results/${scan.id}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl font-black text-green-900 border border-green-200">
                      {gradeLabel(scan.grade)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {scan.productName ?? "Scanned Product"}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(scan.createdAt).toLocaleDateString()}
                        </span>
                        <span>{scan._count.ingredients} ingredients</span>
                        <span>Score: {scan.overallScore}/100</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-700 transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Bookmarks */}
          <div className="space-y-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-700" />
              Saved Ingredients
            </h2>
            {bookmarks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                <Leaf className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No saved ingredients</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((b) =>
                  b.ingredient ? (
                    <Link
                      key={b.id}
                      href={`/ingredients/${b.ingredient.slug}`}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-green-200 transition-colors text-sm"
                    >
                      <span className="text-base">{b.ingredient.category.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{b.ingredient.name}</p>
                        <p className="text-xs text-gray-400">{b.ingredient.category.name}</p>
                      </div>
                    </Link>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
