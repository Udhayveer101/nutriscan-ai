"use client";

import { useState } from "react";
import { Barcode, ArrowRight, Search } from "lucide-react";

interface Props {
  onAnalyze: (data: { method: string; text?: string; barcode?: string }) => void;
  isLoading: boolean;
}

export function BarcodeTab({ onAnalyze, isLoading }: Props) {
  const [barcode, setBarcode] = useState("");
  const [lookupResult, setLookupResult] = useState<{ name: string; brand: string; ingredientsText: string } | null>(null);
  const [isLooking, setIsLooking] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleLookup = async () => {
    if (!barcode.trim()) return;
    setIsLooking(true);
    setNotFound(false);
    setLookupResult(null);

    try {
      const res = await fetch(`/api/scan/barcode?code=${encodeURIComponent(barcode.trim())}`);
      if (!res.ok) { setNotFound(true); return; }
      const data = await res.json();
      setLookupResult(data);
    } finally {
      setIsLooking(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center py-6">
        <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
          <Barcode className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">
          Enter a product barcode (EAN-13, UPC-A, or EAN-8) to look up its ingredients
          via the Open Food Facts database.
        </p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleLookup()}
          placeholder="e.g. 8901030868825"
          maxLength={14}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          onClick={handleLookup}
          disabled={barcode.length < 8 || isLooking}
          className="btn-primary px-4 disabled:opacity-50"
        >
          {isLooking ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      {notFound && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          Product not found. Try a different barcode or use the paste method to enter ingredients manually.
        </div>
      )}

      {lookupResult && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-3">
          <div>
            <p className="font-bold text-gray-900">{lookupResult.name}</p>
            <p className="text-sm text-gray-500">{lookupResult.brand}</p>
          </div>
          {lookupResult.ingredientsText && (
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
              {lookupResult.ingredientsText}
            </p>
          )}
          <button
            onClick={() =>
              onAnalyze({
                method: "BARCODE",
                barcode,
                text: lookupResult.ingredientsText,
              })
            }
            disabled={isLoading || !lookupResult.ingredientsText}
            className="w-full btn-primary justify-center disabled:opacity-50"
          >
            Analyze {lookupResult.name}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
