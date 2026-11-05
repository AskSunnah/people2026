// src/app/[locale]/(main)/page.js

import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { getRecentAnswers } from "@/services/question.service";
import { getPinnedSections } from "@/services/pinned.service";
import { getCategories } from "@/services/category.service";
import PinnedSection from "@/components/Home/PinnedSection";
import AskQuestionSection from "@/components/Home/AskQuestionSection";
import RecentAnswers from "@/components/Home/RecentAnswers";
import CategorySidebar from "@/components/Home/CategorySidebar";
import CategoryChips from "@/components/Home/CategoryChips";
import LibraryCard from "@/components/Home/LibraryCard";
import RightRail from "@/components/Home/Rightrail";

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

  // TODO: if you have a cheap book-count query, pass it here.
  const bookCount = undefined;

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
    isPartOf: { "@id": `${SITE_URL}/#website` },
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

  // Separate ItemList so categories are described to search engines too
  const categoriesSchema = categories.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${SITE_URL}/${locale}/#categories`,
        name: locale === "ar" ? "التصنيفات" : "Categories",
        itemListElement: categories.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/${locale}/categories/${c.path}`,
          name: c.name,
        })),
      }
    : null;

  const jsonLd = (data) => ({
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(homeSchema)}
      />
      {categoriesSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(categoriesSchema)}
        />
      )}

      {/* <1024: 1 column | 1024-1279: left rail + main | 1280+: left + main + right */}
      <div
        className="mx-auto my-8 grid max-w-[1280px] items-start gap-6 px-4
          lg:grid-cols-[220px_minmax(0,1fr)]
          xl:grid-cols-[230px_minmax(0,1fr)_260px]
          max-md:my-0 max-md:px-0"
      >
        {/* Left rail (from lg) */}
        <aside className="sticky top-4 hidden lg:block">
          <CategorySidebar categories={categories} locale={locale} />
        </aside>

        {/* Main column: DOM order = Ask, topics, library, answers (good for SEO + mobile) */}
        <main
          className="
            min-w-0 bg-[var(--bg-main)] px-6 py-6 text-[var(--text-main)]
            rounded-[10px] shadow-[2px_3px_12px_rgba(0,0,0,0.14)]
            [&>section]:mb-8
            [&_h2]:text-[var(--bg-color-header)] [&_h3]:text-[var(--bg-color-header)]
            max-md:rounded-none max-md:bg-white max-md:px-4 max-md:py-4 max-md:shadow-none
          "
        >
          {pinnedSections.length > 0 && (
            <PinnedSection sections={pinnedSections} direction={direction} />
          )}

          <AskQuestionSection direction={direction} locale={locale} />

          {/* Chips show below lg; Library banner shows below xl (right rail holds it on xl+) */}
          <CategoryChips categories={categories} locale={locale} />
          <div className="mb-8 xl:hidden">
            <LibraryCard locale={locale} bookCount={bookCount} />
          </div>

          <RecentAnswers
            initialAnswers={answers}
            direction={direction}
            locale={locale}
          />
        </main>

        {/* Right rail */}
        <aside className="sticky top-4 hidden xl:block">
          <RightRail locale={locale} bookCount={bookCount} />
        </aside>
      </div>
    </>
  );
}
