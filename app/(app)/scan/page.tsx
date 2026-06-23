import { ScannerInterface } from "@/components/scan/ScannerInterface";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan Product",
  description: "Upload a photo, use camera, paste ingredients, or scan a barcode to analyze food products.",
};

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-blue-50/20 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4">
            Scan Your Food
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Upload an image, use camera, paste an ingredient list, or scan a barcode.
            Get instant AI-powered analysis.
          </p>
        </div>
        <ScannerInterface />
      </div>
    </div>
  );
}
