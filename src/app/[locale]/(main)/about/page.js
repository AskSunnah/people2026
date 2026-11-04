// src/app/[locale]/(main)/about/page.js
import { getTranslations } from "next-intl/server";
import AboutUs from "@/components/About/AboutUs";

import { buildMetadata, SITE_URL } from "@/lib/seo";

// src/app/[locale]/(main)/about/page.js
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadata({
    locale,
    path: "/about",
    title: t("seo.title"),
    description: t("seo.description"),
  });
}
export default async function AboutPage({ params }) {
  const { locale } = await params;

    const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/${locale}/about#webpage`,
    url: `${SITE_URL}/${locale}/about`,
    name: locale === "ar" ? "من نحن" : "About AskSunnah",
    inLanguage: locale,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

   return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema).replace(/</g, "\\u003c"),
        }}
      />
      <AboutUs />
    </>
  );
}