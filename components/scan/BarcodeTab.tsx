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
    if (!barcode.trim() || isLooking) return;
    setIsLooking(true);
    setNotFound(false);
    setLookupResult(null);

    try {
      const res = await fetch(`/api/scan/barcode?code=${encodeURIComponent(barcode.trim())}`);
      if (!res.ok) { setNotFound(true); return; }
      const data = await res.json();
      if (data && data.name) {
        setLookupResult(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setIsLooking(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center py-6">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(20,70,45,.05)", border: "1px solid rgba(20,70,45,.08)" }}>
          <Barcode className="w-10 h-10" style={{ color: "var(--muted-4)" }} />
        </div>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
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
          className="flex-1 px-4 py-3.5 rounded-2xl text-sm font-mono focus:outline-none"
          style={{ background: "rgba(255,255,255,.6)", border: "1px solid rgba(20,70,45,.12)", color: "var(--ink-2)" }}
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
        <div className="p-4 rounded-2xl text-sm" style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.25)", color: "#92620a" }}>
          Product not found. Try a different barcode or use the paste method to enter ingredients manually.
        </div>
      )}

      {lookupResult && (
        <div className="p-4 rounded-2xl space-y-3" style={{ background: "rgba(22,163,74,.06)", border: "1px solid rgba(22,163,74,.2)" }}>
          <div>
            <p className="font-heading font-bold" style={{ color: "var(--ink-2)" }}>{lookupResult.name}</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{lookupResult.brand}</p>
          </div>
          {lookupResult.ingredientsText && (
            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--muted)" }}>
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
