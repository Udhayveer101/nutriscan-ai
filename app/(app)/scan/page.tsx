import { ScannerInterface } from "@/components/scan/ScannerInterface";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan Product",
  description: "Upload a photo, use camera, paste ingredients, or scan a barcode to analyze food products.",
};

export default function ScanPage() {
  return (
    <div className="min-h-screen pb-tab-bar md:pb-16 pt-14 md:pt-20" style={{ background: "var(--ios-bg)" }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="pt-6 pb-5">
          <h1 className="text-[28px] font-bold tracking-tight text-gray-900">Scan Food</h1>
          <p className="text-[15px] mt-1" style={{ color: "var(--ios-label2)" }}>
            Upload a photo, paste ingredients, or scan a barcode for instant AI analysis.
          </p>
        </div>
        <ScannerInterface />
      </div>
    </div>
  );
}
