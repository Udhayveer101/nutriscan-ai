import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";

const heading = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const monoLabel = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NutriScan AI — Know What's Really In Your Food",
    template: "%s | NutriScan AI",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  description:
    "Scan food ingredient lists and instantly understand preservatives, additives, sweeteners, and other food components through AI-powered analysis.",
  keywords: [
    "food ingredients",
    "ingredient scanner",
    "food additives",
    "preservatives",
    "nutrition analysis",
    "food safety",
    "AI food analysis",
    "ingredient checker",
  ],
  authors: [{ name: "NutriScan AI" }],
  creator: "NutriScan AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nutriscan.ai",
    siteName: "NutriScan AI",
    title: "NutriScan AI — Know What's Really In Your Food",
    description:
      "AI-powered consumer awareness platform that makes food labels transparent and understandable.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NutriScan AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriScan AI",
    description: "Know what's really in your food.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f5f1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${monoLabel.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
