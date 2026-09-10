// src/app/[locale]/(main)/contribute/cancel/page.js
import { getTranslations } from "next-intl/server";
import DonationStatusCard from "@/components/Contribute/DonationStatusCard";
import { NOINDEX_FOLLOW } from "@/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("contribute.cancel");
  return { title: t("title"),  
    robots: NOINDEX_FOLLOW 
   };
}

export default async function ContributeCancelPage() {
  const t = await getTranslations("contribute.cancel");

  return (
    <DonationStatusCard
      variant="cancel"
      title={t("title")}
      message={t("message")}
      linkLabel={t("backLink")}
    />
  );
}