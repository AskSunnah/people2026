// src/app/[locale]/(main)/contribute/page.js
import { getTranslations } from "next-intl/server";
import Contribute from "@/components/Contribute/Contribute";
import { buildMetadata } from "@/lib/seo";

// src/app/[locale]/(main)/contribute/page.js
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contribute" });
  return buildMetadata({
    locale,
    path: "/contribute",
    title: t("seo.title"),
    description: t("seo.description"),
  });
}

export default function ContributePage() {
  return <Contribute />;
}