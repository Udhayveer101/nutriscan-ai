import { NextRequest, NextResponse } from "next/server";
import { lookupBarcode, isValidBarcode } from "@/lib/barcode";
import { rateLimit, clientKey } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
  // Proxies an external API — throttle to avoid being used as an open relay.
  const rl = rateLimit(clientKey(req, "barcode"), 30, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }
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
