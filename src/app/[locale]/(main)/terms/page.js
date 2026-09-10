// src/app/[locale]/(main)/terms/page.js
import { getTranslations } from "next-intl/server";
import TermsContent from "@/components/Terms/TermsContent";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return buildMetadata({
    locale,
    path: "/terms",
    title: t("seo.title"),
    description: t("seo.description"),
  });
}

export default function TermsPage() {
  return <TermsContent />;
}