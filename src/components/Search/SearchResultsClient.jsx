"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle, Inbox } from "lucide-react";

import QuestionItem from "@/components/Home/QuestionItem";
import Pagination from "@/components/Home/Pagination";
import SearchBarQuestion from "@/components/common/SearchBarQuestion";
import QuestionItemSkeleton from "@/components/common/QuestionItemSkeleton";
import { searchAnswers } from "@/services/question.service";

const ITEMS_PER_PAGE = 5;

export default function SearchResultsClient({
  initialResults = [],
  initialTotal = 0,
  initialError = "",
  direction = "ltr",
  locale = "en",
}) {
  const t = useTranslations("search");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const isRTL = direction === "rtl";

  const [results, setResults] = useState(initialResults);
  const [totalItems, setTotalItems] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  // The server already fetched results matching the URL this component
  // mounted with — skip the very first run so we don't immediately
  // re-fetch what page.js just gave us.
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setTotalItems(0);
      setError("");
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await searchAnswers({
          query,
          page,
          limit: ITEMS_PER_PAGE,
          lang: locale,
          signal: controller.signal,
        });

        setResults(data.results || []);
        setTotalItems(data.totalItems || data.total || 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          setResults([]);
          setTotalItems(0);
          setError(t("error"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    return () => controller.abort();
  }, [query, page, locale, t]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "") {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    // pathname here is locale-agnostic ("/search") — router.push from
    // @/i18n/navigation prefixes it with the current locale automatically.
    router.push(`${pathname}?${next.toString()}`);
  };

  const handlePageChange = (newPage) => updateParams({ page: newPage });
  const handleNewSearch = (newQuery) => updateParams({ q: newQuery, page: "1" });
  const clearSearch = () => router.replace("/");

  return (
    <>
      <div className={isRTL ? "text-right" : "text-left"}>
        <h1 className="m-0 text-[1.15rem] sm:text-[1.4rem] font-bold text-[var(--bg-color-header)]">
          {t("title")}
        </h1>

        {query && (
          <span className="text-[0.95rem] block mt-2">
            {t("resultsFor")} <strong>“{query}”</strong>
          </span>
        )}

        {!loading && query && (
          <span className="text-[0.9rem] text-gray-500 block mt-2">
            {totalItems} {totalItems === 1 ? t("result") : t("results")}
          </span>
        )}

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="
              mt-3 rounded-full bg-[#f3ead6]
              px-4 py-2 text-[0.85rem] font-medium
              text-[var(--bg-color-header)]
              hover:bg-[#ead9b5]
              transition
            "
          >
            {t("showAll")}
          </button>
        )}
      </div>

      <div className="my-8">
        <SearchBarQuestion
          direction={direction}
          placeholder={t("searchPlaceholder")}
          initialValue={query}
          isSearchMode={Boolean(query)}
          onSubmit={handleNewSearch}
          onClear={clearSearch}
        />
      </div>

      {loading && (
        <div>
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <QuestionItemSkeleton key={i} direction={direction} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <AlertTriangle size={32} className="text-red-500" />
          <p className="text-red-600 font-semibold text-base">{error}</p>
        </div>
      )}

      {!loading && !error && query && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <Inbox size={32} className="text-[var(--bg-color-header)]" />
          <p className="text-[var(--bg-color-header)] font-semibold text-base">
            {t("noResultsFor", { query })}
          </p>

          <button
            type="button"
            onClick={clearSearch}
            className="
              mt-2 rounded-full bg-[#f3ead6]
              px-4 py-2 text-[0.85rem] font-medium
              text-[var(--bg-color-header)]
              hover:bg-[#ead9b5]
              transition
            "
          >
            {t("showAll")}
          </button>
        </div>
      )}

      {!loading && !error && !query && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <Inbox size={32} className="text-[var(--bg-color-header)]" />
          <p className="text-[var(--bg-color-header)] font-semibold text-base">
            {t("typeToSearch")}
          </p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <div id="fatwaList">
            {results.map((item, index) => (
              <QuestionItem
                key={item._id || item.slug || index}
                index={(page - 1) * ITEMS_PER_PAGE + index}
                item={item}
                labelPrefix={isRTL ? "س" : "Q"}
                direction={direction}
                locale={locale}
                currentPage={page}
                highlightQuery={query}
              />
            ))}
          </div>

          <Pagination
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}
