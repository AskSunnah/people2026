// src/app/[locale]/(content)/search/page.js

import { setRequestLocale, getTranslations } from "next-intl/server";
import { searchAnswers } from "@/services/question.service";
import SearchResultsClient from "@/components/Search/SearchResultsClient";

const ITEMS_PER_PAGE = 5;

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || "";

  return {
    title: q ? `${q} — Search` : "Search",
    // Search-results pages are thin/duplicate content — keep them out
    // of the index, but still let crawlers follow links from them.
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ params, searchParams }) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  const direction = locale === "ar" ? "rtl" : "ltr";
  const query = sp?.q || "";
  const page = parseInt(sp?.page) || 1;

  const t = await getTranslations("search");

  let initialResults = [];
  let initialTotal = 0;
  let initialError = "";

  if (query.trim()) {
    try {
      const data = await searchAnswers({ query, page, limit: ITEMS_PER_PAGE, lang: locale });
      initialResults = data.results || [];
      initialTotal = data.totalItems || data.total || 0;
    } catch {
      initialError = t("error");
    }
  }

  return (
    <main
      aria-label="Search Results"
      dir={direction}
      className={`
        max-w-[900px] mx-auto my-8 px-6 py-6
        bg-[var(--bg-main)] text-[var(--text-main)]
        rounded-[10px] shadow-[2px_3px_12px_rgba(0,0,0,0.14)]
        max-md:px-4 max-md:py-4 max-md:mx-4 max-md:bg-white max-md:rounded-none max-md:shadow-none
        ${direction === "rtl" ? "text-right [font-family:'Tajawal','Cairo',sans-serif]" : "text-left"}
      `}
    >
      <SearchResultsClient
        initialResults={initialResults}
        initialTotal={initialTotal}
        initialError={initialError}
        direction={direction}
        locale={locale}
      />
    </main>
  );
}
