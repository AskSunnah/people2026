// src/app/[locale]/(main)/contribute/page.js
import { getTranslations } from "next-intl/server";
import Contribute from "@/components/Contribute/Contribute";

import { buildMetadata, SITE_URL } from "@/lib/seo";

// src/app/[locale]/(main)/contribute/page.js
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contribute" });
  return buildMetadata({
    locale,
    path: "/contribute",
    title: t("seo.title"),
    description: t("seo.description"),
  });
}

export default async function ContributePage({ params }) {
  const { locale } = await params;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/${locale}/contribute#webpage`,
    url: `${SITE_URL}/${locale}/contribute`,
    name: locale === "ar" ? "المساهمة" : "Contribute to AskSunnah",
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
      <Contribute />
    </>
  );
}