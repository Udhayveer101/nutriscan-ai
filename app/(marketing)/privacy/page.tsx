import { LegalPage } from "@/components/legal/LegalPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      badge="Legal"
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your information."
      lastUpdated="June 2026"
      sections={[
        {
          title: "Information We Collect",
          content: [
            "Account information (name, email) when you sign in with Google.",
            "Scan data: ingredient text, uploaded images, and barcode values you submit for analysis.",
            "Usage data: pages visited, features used, and scan history.",
            "Device information: browser type, operating system, and IP address for security purposes.",
          ],
          type: "list",
        },
        {
          title: "How We Use Your Information",
          content: [
            "To provide ingredient analysis and AI-powered explanations.",
            "To save your scan history and bookmarks when you are signed in.",
            "To improve our ingredient database and AI models.",
            "To send product updates and educational content (only if you opt in).",
            "To detect and prevent fraud or abuse of the platform.",
          ],
          type: "list",
        },
        {
          title: "Data Storage & Security",
          content:
            "Your data is stored on secure servers hosted on Vercel and managed via PostgreSQL. We use industry-standard encryption in transit (TLS) and at rest. We never sell your personal data to third parties.",
        },
        {
          title: "Image & Scan Data",
          content:
            "Images you upload for ingredient scanning are processed in real time by Google Cloud Vision API and are not stored permanently after analysis. Extracted ingredient text and results are saved to your account if you are signed in.",
        },
        {
          title: "Third-Party Services",
          content: [
            "Google OAuth — for sign-in authentication.",
            "Google Cloud Vision API — for OCR text extraction from images.",
            "Google Gemini AI — for AI-powered ingredient explanations.",
            "Open Food Facts — for product data via barcode lookup (public database).",
          ],
          type: "list",
        },
        {
          title: "Your Rights (GDPR)",
          content: [
            "Right to access: request a copy of all data we hold about you.",
            "Right to deletion: request that your account and all associated data be deleted.",
            "Right to portability: export your scan history in JSON format.",
            "Right to correction: update or correct your account information at any time.",
          ],
          type: "list",
        },
        {
          title: "Cookies",
          content:
            "We use essential session cookies to keep you signed in. We do not use third-party advertising cookies or tracking pixels. You can clear cookies at any time through your browser settings.",
        },
        {
          title: "Contact",
          content:
            "For any privacy-related questions or data requests, email us at legal@nutriscan.ai. We respond to all requests within 30 days.",
        },
      ]}
    />
  );
}
