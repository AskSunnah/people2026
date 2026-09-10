// src/app/[locale]/(main)/contribute/success/page.js
import { getTranslations } from "next-intl/server";
import DonationStatusCard from "@/components/Contribute/DonationStatusCard";
import { NOINDEX_FOLLOW } from "@/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("contribute.success");

  return {
    title: t("title"),
    robots: NOINDEX_FOLLOW,
  };
}

export default async function ContributeSuccessPage() {
  const t = await getTranslations("contribute.success");

  return (
    <DonationStatusCard
      variant="success"
      title={t("title")}
      message={t("message")}
      linkLabel={t("backLink")}
    />
  );
}
