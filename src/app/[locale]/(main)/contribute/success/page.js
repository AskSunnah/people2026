// src/app/[locale]/(main)/contribute/success/page.js
import { getTranslations } from "next-intl/server";
import DonationStatusCard from "@/components/Contribute/DonationStatusCard";

export async function generateMetadata() {
  const t = await getTranslations("contribute.success");
  return { title: t("title") };
}

export default async function ContributeSuccessPage() {
  const t = await getTranslations("contribute.success");

  return (
    <DonationStatusCard
      icon="✓"
      iconColorClass="text-green-600"
      title={t("title")}
      message={t("message")}
      linkLabel={t("backLink")}
    />
  );
}