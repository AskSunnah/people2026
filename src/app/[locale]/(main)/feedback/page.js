// src/app/[locale]/(main)/feedback/page.js
import { getTranslations } from "next-intl/server";
import FeedbackForm from "@/components/Feedback/FeedbackForm";

export async function generateMetadata() {
  const t = await getTranslations("feedback");
  return {
    title: t("pageTitle"),
    description: t("subtitle"),
  };
}

export default function FeedbackPage() {
  return <FeedbackForm />;
}