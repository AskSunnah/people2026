// src/app/[locale]/(main)/feedback/page.js
import { getTranslations } from "next-intl/server";
import FeedbackForm from "@/components/Feedback/FeedbackForm";
import { buildMetadata } from "@/lib/seo";
// src/app/[locale]/(main)/feedback/page.js
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "feedback" });
  return buildMetadata({
    locale,
    path: "/feedback",
    title: t("seo.title"),
    description: t("seo.description"),
  });
}

export default function FeedbackPage() {
  return <FeedbackForm />;
}