// src/app/[locale]/(main)/terms/page.js
import { getTranslations } from "next-intl/server";
import TermsContent from "@/components/Terms/TermsContent";

export async function generateMetadata() {
  const t = await getTranslations("terms");
  return {
    title: t("pageTitle"),
  };
}

export default function TermsPage() {
  return <TermsContent />;
}