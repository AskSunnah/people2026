// src/app/[locale]/(main)/about/page.js
import { getTranslations } from "next-intl/server";
import AboutUs from "@/components/About/AboutUs";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return {
    title: t("pageTitle"),
    description: t("headerSubtitle"),
  };
}

export default function AboutPage() {
  return <AboutUs />;
}