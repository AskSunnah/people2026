// src/app/[locale]/(main)/page.js

import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { getRecentAnswers } from "@/services/question.service";
import { getPinnedSections } from "@/services/pinned.service";
import { SITE_URL } from "@/lib/seo";
import PinnedSection from "@/components/Home/PinnedSection";
import AskQuestionSection from "@/components/Home/AskQuestionSection";
import RecentAnswers from "@/components/Home/RecentAnswers";
import { getCategories } from "@/services/category.service";
import CategorySection from "@/components/Home/CategorySection";

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

  const [answersResult, pinned, categoriesResult] = await Promise.allSettled([
    getRecentAnswers(locale),
    getPinnedSections(locale),
    getCategories(locale, true),
  ]);
  const answers =
    answersResult.status === "fulfilled" && Array.isArray(answersResult.value)
      ? answersResult.value.slice().reverse()
      : [];

  const pinnedSections =
    pinned.status === "fulfilled" && pinned.value?.active
      ? pinned.value.sections || []
      : [];
  const categories =
    categoriesResult.status === "fulfilled" &&
    Array.isArray(categoriesResult.value)
      ? categoriesResult.value
      : [];

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/${locale}/#webpage`,
    url: `${SITE_URL}/${locale}`,
    name: "AskSunnah",
    description:
      locale === "ar"
        ? "اسأل وتصفح الإجابات الإسلامية في مكتبة أسك سنة."
        : "Explore Islamic questions and answers on AskSunnah.",
    inLanguage: locale,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${SITE_URL}/${locale}/#recent-answers`,
      name: locale === "ar" ? "أحدث الإجابات" : "Recent Answers",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: answers.length,
      itemListElement: answers.slice(0, 5).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/${locale}/questions/${item.slug}`,
        name: item.heading,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeSchema).replace(/</g, "\\u003c"),
        }}
      />
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

        <CategorySection categories={categories} locale={locale} />
        <RecentAnswers
          initialAnswers={answers}
          direction={direction}
          locale={locale}
        />
      </div>
    </>
  );
}
