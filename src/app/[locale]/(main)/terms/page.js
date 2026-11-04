// src/app/[locale]/(main)/terms/page.js
import { getTranslations } from "next-intl/server";
import TermsContent from "@/components/Terms/TermsContent";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/seo";

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
export default async function TermsPage({ params }) {
  const { locale } = await params;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/${locale}/terms#webpage`,
    url: `${SITE_URL}/${locale}/terms`,
    name: locale === "ar" ? "الشروط والأحكام" : "Terms and Conditions",
    inLanguage: locale,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <TermsContent />
    </>
  );
}