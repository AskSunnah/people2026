// src/app/[locale]/(main)/contribute/cancel/page.js
import { getTranslations } from "next-intl/server";
import DonationStatusCard from "@/components/Contribute/DonationStatusCard";

export async function generateMetadata() {
  const t = await getTranslations("contribute.cancel");
  return { title: t("title") };
}

export default async function ContributeCancelPage() {
  const t = await getTranslations("contribute.cancel");

  return (
    <DonationStatusCard
      icon="✕"
      iconColorClass="text-red-500"
      title={t("title")}
      message={t("message")}
      linkLabel={t("backLink")}
    />
  );
}