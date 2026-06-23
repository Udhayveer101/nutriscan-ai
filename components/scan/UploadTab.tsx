"use client";

import { useState, useRef, useCallback, DragEvent } from "react";
import { Upload, X, ImageIcon, ArrowRight } from "lucide-react";
import Image from "next/image";

interface Props {
  onAnalyze: (data: { method: string; text?: string }) => void;
  isLoading: boolean;
}

export function UploadTab({ onAnalyze, isLoading }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidImage = (f: File) =>
    f.type.startsWith("image/") ||
    f.name.toLowerCase().endsWith(".heic") ||
    f.name.toLowerCase().endsWith(".heif");

  const handleFile = useCallback(async (f: File) => {
    if (!isValidImage(f)) return;
    setFile(f);
    // HEIC files can't be previewed natively in browsers — show placeholder
    const isHeic = f.name.toLowerCase().endsWith(".heic") || f.name.toLowerCase().endsWith(".heif");
    setPreview(isHeic ? null : URL.createObjectURL(f));
    setExtractedText(null);

    // OCR extraction
    setIsExtracting(true);
    try {
      const fd = new FormData();
      fd.append("image", f);
      const res = await fetch("/api/scan/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ingredientText) setExtractedText(data.ingredientText);
    } catch {
      // OCR failed, user can proceed anyway
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleSubmit = () => {
    if (!extractedText) return;
    onAnalyze({ method: "IMAGE", text: extractedText });
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-green-500 bg-green-50 scale-[1.01]"
              : "border-gray-200 hover:border-green-400 hover:bg-green-50/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.heic,.heif"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
              <Upload className="w-7 h-7 text-green-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Drop your image here, or{" "}
                <span className="text-green-700">browse</span>
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, WEBP, HEIC up to 10MB · Works with product labels, packaging photos
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
            {preview ? (
              <Image
                src={preview}
                alt="Uploaded food label"
                width={600}
                height={300}
                className="w-full object-contain max-h-64"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-10 px-4">
                <ImageIcon className="w-10 h-10 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">{file?.name}</p>
                <p className="text-xs text-gray-400">HEIC preview not supported in browser — extracting text…</p>
              </div>
            )}
            <button
              onClick={() => { setFile(null); setPreview(null); setExtractedText(null); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white shadow border border-gray-100 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Extracted text preview */}
          {isExtracting && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
              <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
              Extracting ingredients via OCR...
            </div>
          )}

          {extractedText && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-4 h-4 text-green-700" />
                <span className="text-sm font-semibold text-green-800">Extracted ingredients:</span>
              </div>
              <p className="text-xs text-green-700 leading-relaxed line-clamp-3">
                {extractedText}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!extractedText || isLoading || isExtracting}
            className="w-full btn-primary py-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Analyze Ingredients
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
