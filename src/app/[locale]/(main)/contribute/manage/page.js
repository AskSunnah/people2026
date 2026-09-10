// src/app/[locale]/(main)/contribute/manage/page.js
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import ManageSubscription from "@/components/Contribute/ManageSubscription";
import { NOINDEX_FOLLOW } from "@/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("contribute.manage");
  return { title: t("title"), robots: NOINDEX_FOLLOW };
}

export default function ManageSubscriptionPage() {
  return (
    <Suspense fallback={null}>
      <ManageSubscription />
    </Suspense>
  );
}