import { ImageResponse } from "next/og";

// Social preview served at /og-image.png (referenced by openGraph/twitter metadata in
// app/layout.tsx). Rendered once at build time — no static asset to keep in sync.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1a5c2a 0%, #0f3a1a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "rgba(255,255,255,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="72" height="72" viewBox="0 0 200 200">
              <path
                d="M100 158 C46 158 28 112 40 68 C52 26 100 20 124 32 C150 44 170 76 162 114 C154 146 128 158 100 158 Z"
                fill="#1a5c2a"
              />
            </svg>
          </div>
          <div style={{ fontSize: 64, fontWeight: 800 }}>NutriScan AI</div>
        </div>
        <div style={{ fontSize: 44, marginTop: 48, fontWeight: 700 }}>
          Know what&apos;s really in your food.
        </div>
        <div style={{ fontSize: 30, marginTop: 20, opacity: 0.85 }}>
          Scan any ingredient label for evidence-based safety scores on additives,
          preservatives and sweeteners.
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
