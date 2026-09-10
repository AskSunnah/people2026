// src/app/[locale]/(main)/page.js

import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { getRecentAnswers } from "@/services/question.service";
import { getPinnedSections } from "@/services/pinned.service";

import PinnedSection from "@/components/Home/PinnedSection";
import AskQuestionSection from "@/components/Home/AskQuestionSection";
import RecentAnswers from "@/components/Home/RecentAnswers";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildMetadata({
    locale,
    path: "/",
    title: t("seo.title"),
    description: t("seo.description"),
  });
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const direction = locale === "ar" ? "rtl" : "ltr";

  const [answersResult, pinned] = await Promise.allSettled([
    getRecentAnswers(locale),
    getPinnedSections(locale),
  ]);

  // Old React app did `data.slice().reverse()` to show newest first —
  // keeping that here. If your backend already returns newest-first,
  // drop the .reverse().
  const answers =
    answersResult.status === "fulfilled" && Array.isArray(answersResult.value)
      ? answersResult.value.slice().reverse()
      : [];

  const pinnedSections =
    pinned.status === "fulfilled" && pinned.value?.active
      ? pinned.value.sections || []
      : [];

  return (
    <div
      className="
        max-w-[900px] mx-auto my-8 px-6 py-6
        bg-[var(--bg-main)] text-[var(--text-main)]
        rounded-[10px] shadow-[2px_3px_12px_rgba(0,0,0,0.14)]
        [&>section]:mb-8
        [&_h2]:text-[var(--bg-color-header)] [&_h3]:text-[var(--bg-color-header)]
        max-md:px-4 max-md:py-4 max-md:mx-4 max-md:bg-white max-md:rounded-none max-md:shadow-none
      "
    >
      {pinnedSections.length > 0 && (
        <PinnedSection sections={pinnedSections} direction={direction} />
      )}

      <AskQuestionSection direction={direction} locale={locale} />

      <RecentAnswers
        initialAnswers={answers}
        direction={direction}
        locale={locale}
      />
    </div>
  );
}
