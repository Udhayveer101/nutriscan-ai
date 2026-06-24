"use client";

import { useState, useRef, useCallback, useEffect, DragEvent } from "react";
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
  const abortRef = useRef<AbortController | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Revoke blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const isValidImage = (f: File) =>
    f.type.startsWith("image/") ||
    f.name.toLowerCase().endsWith(".heic") ||
    f.name.toLowerCase().endsWith(".heif");

  const clearFile = useCallback(() => {
    abortRef.current?.abort();
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setFile(null);
    setPreview(null);
    setExtractedText(null);
    setIsExtracting(false);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const handleFile = useCallback(async (f: File) => {
    if (!isValidImage(f)) return;

    // Cancel any in-flight OCR request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Revoke previous preview URL before creating a new one
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    setFile(f);
    const isHeic = f.name.toLowerCase().endsWith(".heic") || f.name.toLowerCase().endsWith(".heif");
    if (!isHeic) {
      const url = URL.createObjectURL(f);
      previewUrlRef.current = url;
      setPreview(url);
    } else {
      previewUrlRef.current = null;
      setPreview(null);
    }
    setExtractedText(null);
    setIsExtracting(true);

    try {
      const fd = new FormData();
      fd.append("image", f);
      const res = await fetch("/api/scan/upload", {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });
      const data = await res.json();
      if (data.ingredientText) setExtractedText(data.ingredientText);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        // OCR failed silently — user can still proceed with manual text
      }
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
          className="relative rounded-3xl p-10 text-center cursor-pointer transition-all duration-150 active:scale-[0.99] select-none"
          style={{
            background: isDragging ? "rgba(26,92,42,0.06)" : "var(--ios-surface2)",
            border: `2px dashed ${isDragging ? "rgba(26,92,42,0.4)" : "rgba(60,60,67,0.15)"}`,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.heic,.heif"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-[22px] flex items-center justify-center" style={{ background: "rgba(26,92,42,0.1)" }}>
              <Upload className="w-7 h-7" style={{ color: "var(--ios-tint)" }} />
            </div>
            <div>
              <p className="font-semibold text-[16px] text-gray-900">
                Tap to upload a photo
              </p>
              <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "var(--ios-label2)" }}>
                PNG, JPG, WEBP, HEIC · Works with ingredient labels & packaging
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview */}
          <div className="relative rounded-2xl overflow-hidden" style={{ background: "var(--ios-surface2)" }}>
            {preview ? (
              <Image
                src={preview}
                alt="Uploaded food label"
                width={600}
                height={300}
                className="w-full object-contain max-h-56"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-10 px-4">
                <ImageIcon className="w-10 h-10" style={{ color: "var(--ios-label3)" }} />
                <p className="text-[14px] font-medium text-gray-700">{file?.name}</p>
                <p className="text-[12px]" style={{ color: "var(--ios-label2)" }}>HEIC — extracting text…</p>
              </div>
            )}
            <button
              onClick={clearFile}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* OCR status */}
          {isExtracting && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl text-[13px]" style={{ background: "rgba(0,122,255,0.08)", color: "#0066cc" }}>
              <div className="w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
              Reading ingredient list…
            </div>
          )}

          {extractedText && (
            <div className="p-4 rounded-2xl" style={{ background: "rgba(52,199,89,0.08)", border: "1px solid rgba(52,199,89,0.2)" }}>
              <p className="text-[12px] font-semibold mb-1.5" style={{ color: "var(--ios-tint)" }}>Extracted ingredients:</p>
              <p className="text-[12px] leading-relaxed line-clamp-3" style={{ color: "#1a5c2a" }}>
                {extractedText}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!extractedText || isLoading || isExtracting}
            className="w-full btn-primary py-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Analyse Ingredients
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
