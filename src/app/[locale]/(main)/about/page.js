// src/app/[locale]/(main)/about/page.js
import { getTranslations } from "next-intl/server";
import AboutUs from "@/components/About/AboutUs";
import { buildMetadata } from "@/lib/seo";

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
export default function AboutPage() {
  return <AboutUs />;
}