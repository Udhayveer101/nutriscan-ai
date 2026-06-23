"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

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

function getGrade(score: number) {
  if (score >= 90) return { label: "A+", color: "text-green-600 bg-green-50 border-green-300" };
  if (score >= 80) return { label: "A", color: "text-green-700 bg-green-50 border-green-300" };
  if (score >= 70) return { label: "B", color: "text-lime-700 bg-lime-50 border-lime-300" };
  if (score >= 55) return { label: "C", color: "text-amber-700 bg-amber-50 border-amber-300" };
  if (score >= 40) return { label: "D", color: "text-orange-700 bg-orange-50 border-orange-300" };
  return { label: "F", color: "text-red-700 bg-red-50 border-red-300" };
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
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or E-number (e.g. 'sodium benzoate' or 'E211')"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-medium transition-colors ${
            showFilters || selectedCategory
              ? "bg-green-900 text-white border-green-900"
              : "bg-white text-gray-700 border-gray-200 hover:border-green-300"
          }`}
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
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  !selectedCategory
                    ? "bg-green-900 text-white border-green-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                }`}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-green-900 text-white border-green-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...
            </span>
          ) : (
            `${total} ingredient${total !== 1 ? "s" : ""} found`
          )}
        </span>
        {(query || selectedCategory) && (
          <button
            onClick={() => { setQuery(""); setSelectedCategory(""); }}
            className="text-green-700 font-medium hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {ingredients.map((ing, i) => {
            const grade = getGrade(ing.safetyScore);
            return (
              <motion.div
                key={ing.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
              >
                <Link
                  href={`/ingredients/${ing.slug}`}
                  className="block p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:border-green-200 transition-all duration-300 group h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs text-gray-400 font-mono">{ing.category.icon}</span>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide truncate">
                          {ing.category.name}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-green-900 transition-colors">
                        {ing.name}
                      </h3>
                      {ing.eNumber && (
                        <span className="text-[10px] text-gray-400 font-mono">{ing.eNumber}</span>
                      )}
                    </div>
                    <div className={`flex-shrink-0 ml-2 w-9 h-9 rounded-lg border-2 font-black text-sm flex items-center justify-center ${grade.color}`}>
                      {grade.label}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                    {ing.purposeShort}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {ing.isNatural && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                          Natural
                        </span>
                      )}
                    </div>
                    <div className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-green-700" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 disabled:opacity-40 hover:border-green-300 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 disabled:opacity-40 hover:border-green-300 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
