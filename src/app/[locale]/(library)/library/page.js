import { getTranslations } from "next-intl/server";
import LibraryLanding from "@/components/library/LibraryLanding";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "library",
  });

  return {
    title: t("seo.title"),
    description: t("seo.description"),

    alternates: {
      canonical: `/${locale}/library`,
      languages: {
        en: "/en/library",
        ar: "/ar/library",
      },
    },

    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      type: "website",
      locale: locale === "ar" ? "ar" : "en",
      url: `/${locale}/library`,
    },
  };
}

export default function LibraryPage() {
  return <LibraryLanding />;
}
