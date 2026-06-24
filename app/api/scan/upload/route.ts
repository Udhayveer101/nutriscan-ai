import { NextRequest, NextResponse } from "next/server";
import { extractTextFromImageFile } from "@/lib/vision";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const isImage =
      file.type.startsWith("image/") ||
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (!isImage) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 10MB" }, { status: 400 });
    }

    const { text, ingredientText, confidence, ocrProvider } = await extractTextFromImageFile(file);

    return NextResponse.json({ rawText: text, ingredientText, confidence, ocrProvider });
  } catch (error) {
    const msg = (error as Error).message;
    console.error("OCR upload error:", error);

    if (msg === "OCR_BOTH_FAILED") {
      return NextResponse.json(
        { error: "Both OCR providers failed. Please paste the ingredients manually." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process image. Please try again." },
      { status: 500 }
    );
  }
}
