import { LegalPage } from "@/components/legal/LegalPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      badge="Legal"
      title="Terms of Service"
      subtitle="The rules and guidelines for using NutriScan AI."
      lastUpdated="June 2026"
      sections={[
        {
          title: "Acceptance of Terms",
          content:
            "By accessing or using NutriScan AI, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.",
        },
        {
          title: "Educational Purpose Only",
          content:
            "NutriScan AI is an educational information tool. All ingredient analysis, health scores, and AI explanations are for general informational purposes only and do not constitute medical, dietary, or professional health advice. Always consult a qualified healthcare professional for personalized guidance.",
          type: "highlight",
        },
        {
          title: "User Accounts",
          content: [
            "You must provide accurate information when creating an account.",
            "You are responsible for maintaining the security of your account.",
            "You must be at least 13 years old to create an account.",
            "We reserve the right to suspend accounts that violate these terms.",
          ],
          type: "list",
        },
        {
          title: "Acceptable Use",
          content: [
            "You may not use NutriScan AI for any unlawful purpose.",
            "You may not attempt to reverse-engineer, scrape, or abuse our APIs.",
            "You may not upload images containing content that is not food-related ingredient lists.",
            "You may not misrepresent our analysis results as professional medical advice.",
          ],
          type: "list",
        },
        {
          title: "Intellectual Property",
          content:
            "All content on NutriScan AI — including the ingredient database, scoring methodology, and AI explanations — is owned by NutriScan AI or licensed from third parties. You may not reproduce or redistribute this content without written permission.",
        },
        {
          title: "Limitation of Liability",
          content:
            "NutriScan AI is provided 'as is' without warranties of any kind. We are not liable for any decisions made based on the information provided by this platform, including health decisions, dietary changes, or product purchases.",
        },
        {
          title: "Third-Party Data",
          content:
            "Product data retrieved via barcode scanning is sourced from Open Food Facts, a public database. We do not guarantee the accuracy or completeness of third-party product data.",
        },
        {
          title: "Changes to Terms",
          content:
            "We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify signed-in users of significant changes via email.",
        },
      ]}
    />
  );
}
