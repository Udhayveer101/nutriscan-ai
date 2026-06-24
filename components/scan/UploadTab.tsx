"use client";

import { useState, useRef, useCallback, useEffect, DragEvent } from "react";
import { Upload, X, ImageIcon, ArrowRight, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
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
  const [ocrFailed, setOcrFailed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const currentFileRef = useRef<File | null>(null);

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
    setOcrFailed(false);
    setSubmitted(false);
    currentFileRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const runOcr = useCallback(async (f: File) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setExtractedText(null);
    setOcrFailed(false);
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
      if (data.ingredientText && data.ingredientText.trim().length > 0) {
        setExtractedText(data.ingredientText);
        setOcrFailed(false);
      } else {
        setOcrFailed(true);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setOcrFailed(true);
      }
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const handleFile = useCallback(async (f: File) => {
    if (!isValidImage(f)) return;

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    currentFileRef.current = f;
    setFile(f);
    setSubmitted(false);

    const isHeic = f.name.toLowerCase().endsWith(".heic") || f.name.toLowerCase().endsWith(".heif");
    if (!isHeic) {
      const url = URL.createObjectURL(f);
      previewUrlRef.current = url;
      setPreview(url);
    } else {
      previewUrlRef.current = null;
      setPreview(null);
    }

    await runOcr(f);
  }, [runOcr]);

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
    if (submitted) return;
    // Allow submit even without OCR text — the analysis API will handle it
    const text = extractedText ?? "";
    setSubmitted(true);
    onAnalyze({ method: "IMAGE", text });
  };

  const canSubmit = !isExtracting && !isLoading && !submitted && !!file;

  return (
    <div className="space-y-3">
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
              <p className="font-semibold text-[16px] text-gray-900">Tap to upload a photo</p>
              <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "var(--ios-label2)" }}>
                PNG, JPG, WEBP, HEIC · Works with ingredient labels & packaging
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Image preview */}
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
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl text-[13px]"
              style={{ background: "rgba(0,122,255,0.08)", color: "#0066cc" }}>
              <div className="w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
              Reading ingredient list from image…
            </div>
          )}

          {/* OCR success */}
          {extractedText && !isExtracting && (
            <div className="p-4 rounded-2xl" style={{ background: "rgba(52,199,89,0.08)", border: "1px solid rgba(52,199,89,0.2)" }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--ios-tint)" }} />
                <p className="text-[12px] font-semibold" style={{ color: "var(--ios-tint)" }}>Ingredients extracted</p>
              </div>
              <p className="text-[12px] leading-relaxed line-clamp-3" style={{ color: "#1a5c2a" }}>
                {extractedText}
              </p>
            </div>
          )}

          {/* OCR failed — show warning but still allow analysis */}
          {ocrFailed && !isExtracting && (
            <div className="p-4 rounded-2xl" style={{ background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.25)" }}>
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#cc7700" }} />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold" style={{ color: "#cc7700" }}>
                    Could not read text from image
                  </p>
                  <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: "#996600" }}>
                    The image may be blurry, low-res, or at an angle. Try a clearer photo — or use Paste Text to enter ingredients manually.
                  </p>
                  <button
                    onClick={() => currentFileRef.current && runOcr(currentFileRef.current)}
                    className="flex items-center gap-1.5 mt-2 text-[12px] font-semibold"
                    style={{ color: "#cc7700" }}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry OCR
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analyse button — enabled once image is loaded, even if OCR failed */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || (ocrFailed && !extractedText)}
            className="w-full btn-primary py-4 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitted || isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analysing…
              </>
            ) : (
              <>Analyse Ingredients <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          {/* If OCR failed, offer paste text fallback */}
          {ocrFailed && !extractedText && (
            <p className="text-center text-[12px]" style={{ color: "var(--ios-label2)" }}>
              Can't read the image? Switch to <strong>Paste Text</strong> tab above to enter ingredients manually.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
