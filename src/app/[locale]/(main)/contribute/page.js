// src/app/[locale]/(main)/contribute/page.js
import { getTranslations } from "next-intl/server";
import Contribute from "@/components/Contribute/Contribute";

export async function generateMetadata() {
  const t = await getTranslations("contribute");
  return { title: t("headerTitle") };
}

export default function ContributePage() {
  return <Contribute />;
}