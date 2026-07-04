"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { EvidenceBar } from "@/components/ui/EvidenceBar";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface Ingredient {
  id: string;
  slug: string;
  name: string;
  eNumber: string | null;
  purposeShort: string;
  safetyScore: number;
  isNatural: boolean;
  category: { name: string; color: string; icon: string };
}

interface Props {
  categories: Category[];
}

function barColors(score: number): [string, string] {
  if (score >= 80) return ["#4ade80", "#16a34a"];
  if (score >= 50) return ["#fcd34d", "#f59e0b"];
  return ["#fca5a5", "#ef4444"];
}

export function IngredientSearch({ categories }: Props) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchIngredients = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        page: String(page),
        limit: "24",
        ...(selectedCategory && { category: selectedCategory }),
      });
      const res = await fetch(`/api/ingredients?${params}`);
      const data = await res.json();
      setIngredients(data.ingredients ?? []);
      setTotal(data.pagination?.total ?? 0);
      setPages(data.pagination?.pages ?? 1);
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedCategory, page]);

  useEffect(() => {
    const t = setTimeout(fetchIngredients, 300);
    return () => clearTimeout(t);
  }, [fetchIngredients]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedCategory]);

  return (
    <div className="space-y-5">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="glass flex-1 flex items-center gap-3 px-5 rounded-2xl">
          <Search className="w-[17px] h-[17px] flex-shrink-0" style={{ color: "var(--muted-3)" }} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or E-number — e.g. 'sodium benzoate' or 'E211'"
            className="w-full py-4 bg-transparent text-[15px] focus:outline-none"
            style={{ color: "var(--ink-2)" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ color: "var(--muted-3)" }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="glass flex items-center gap-2 px-5 rounded-2xl text-sm font-semibold transition-transform hover:-translate-y-0.5"
          style={{ color: showFilters || selectedCategory ? "var(--brand-800)" : "var(--ink-3)" }}
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Category filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pb-2">
              <button
                onClick={() => setSelectedCategory("")}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                style={!selectedCategory ? { background: "var(--brand-800)", color: "#fff" } : { background: "rgba(255,255,255,.7)", border: "1px solid rgba(20,70,45,.12)", color: "var(--ink-3)" }}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  style={selectedCategory === cat.slug ? { background: "var(--brand-800)", color: "#fff" } : { background: "rgba(255,255,255,.7)", border: "1px solid rgba(20,70,45,.12)", color: "var(--ink-3)" }}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm font-mono-label" style={{ color: "var(--muted-2)" }}>
        <span>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...
            </span>
          ) : (
            `${total} INGREDIENT${total !== 1 ? "S" : ""} FOUND`
          )}
        </span>
        {(query || selectedCategory) && (
          <button onClick={() => { setQuery(""); setSelectedCategory(""); }} className="font-semibold hover:underline" style={{ color: "var(--brand-700)" }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <AnimatePresence mode="popLayout">
          {ingredients.map((ing, i) => {
            const [from, to] = barColors(ing.safetyScore);
            return (
              <motion.div
                key={ing.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
              >
                <Link href={`/ingredients/${ing.slug}`} className="glass block rounded-2xl p-[18px] transition-transform hover:-translate-y-1 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs" style={{ color: "var(--muted-3)" }}>{ing.category.icon}</span>
                        <span className="font-mono-label text-[10px] font-semibold tracking-[.06em] truncate" style={{ color: "var(--muted-3)" }}>
                          {ing.category.name.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-[16px] leading-tight" style={{ color: "var(--ink-2)" }}>
                        {ing.name}
                      </h3>
                      {ing.eNumber && (
                        <span className="font-mono-label text-[10px]" style={{ color: "var(--muted-3)" }}>{ing.eNumber}</span>
                      )}
                    </div>
                    <GradeBadge score={ing.safetyScore} className="ml-2" />
                  </div>

                  <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--muted)" }}>
                    {ing.purposeShort}
                  </p>

                  <div className="flex justify-between font-mono-label text-[9.5px] mb-1.5" style={{ color: "var(--muted-4)" }}>
                    <span>SAFETY</span>
                    <span>{ing.safetyScore}/100</span>
                  </div>
                  <EvidenceBar value={ing.safetyScore} from={from} to={to} />

                  <div className="flex items-center justify-between mt-3">
                    {ing.isNatural ? (
                      <span className="font-mono-label text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #a7e3ba" }}>
                        NATURAL
                      </span>
                    ) : <span />}
                    <ArrowRight className="w-4 h-4" style={{ color: "var(--brand-700)" }} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="glass px-[18px] py-2.5 rounded-[11px] text-sm font-semibold disabled:opacity-40"
            style={{ color: "var(--ink-3)" }}
          >
            Previous
          </button>
          <span className="text-sm font-medium px-3" style={{ color: "var(--muted)" }}>
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-[18px] py-2.5 rounded-[11px] text-sm font-semibold text-white transition-colors disabled:opacity-40"
            style={{ background: "var(--brand-800)" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
