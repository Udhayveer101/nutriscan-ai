import { NextRequest, NextResponse } from "next/server";
import { lookupBarcode, isValidBarcode } from "@/lib/barcode";

export async function GET(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get("code");

  if (!barcode || !isValidBarcode(barcode)) {
    return NextResponse.json({ error: "Invalid barcode" }, { status: 400 });
  }

  const product = await lookupBarcode(barcode);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
