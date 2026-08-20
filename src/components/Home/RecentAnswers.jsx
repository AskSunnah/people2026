"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Inbox } from "lucide-react";

import QuestionItem from "./QuestionItem";
import Pagination from "./Pagination";
import SearchBarQuestion from "../common/SearchBarQuestion";
import { searchAnswers } from "@/services/question.service";

const RecentAnswers = ({ initialAnswers = [], direction = "ltr", locale }) => {
  const t = useTranslations("home.recentAnswers");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [displayedFatwas, setDisplayedFatwas] = useState(initialAnswers);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTotalItems, setSearchTotalItems] = useState(0);

  const itemsPerPage = 5;
  const isRTL = direction === "rtl";
  const questionLabel = isRTL ? "س" : "Q";

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const activeSearch = searchParams.get("q") || "";
  const isSearchMode = activeSearch.trim().length > 0;

  // Non-search mode just paginates the server-provided initial list —
  // no client fetch, no loading spinner needed.
  useEffect(() => {
    if (!isSearchMode) {
      setDisplayedFatwas(initialAnswers);
      setSearchTotalItems(0);
    }
  }, [isSearchMode, initialAnswers]);

  // Search mode fetches from the backend on every q/page change.
  useEffect(() => {
    if (!isSearchMode) return;

    const controller = new AbortController();

    const loadSearchResults = async () => {
      try {
        setSearchLoading(true);
        setError("");

        const data = await searchAnswers({
          lang: locale,
          query: activeSearch,
          page: currentPage,
          limit: itemsPerPage,
          signal: controller.signal,
        });

        setDisplayedFatwas(data.results || []);
        setSearchTotalItems(data.totalItems || data.total || 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          setDisplayedFatwas([]);
          setSearchTotalItems(0);
          setError(t("searchError"));
        }
      } finally {
        setSearchLoading(false);
      }
    };

    loadSearchResults();

    return () => controller.abort();
  }, [isSearchMode, activeSearch, currentPage, locale, t]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "") {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const setCurrentPage = (page) => updateParams({ page });

  const submitSearch = (queryValue) => {
    const query = queryValue.trim();
    updateParams({ q: query || null, page: "1" });
  };

  const clearSearch = () => {
    setDisplayedFatwas(initialAnswers);
    setSearchTotalItems(0);
    setError("");
    router.replace(pathname, { scroll: false });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedFatwas = isSearchMode
    ? displayedFatwas
    : displayedFatwas.slice(startIndex, startIndex + itemsPerPage);

  const totalItemsForPagination = isSearchMode
    ? searchTotalItems
    : displayedFatwas.length;

  return (
    <section aria-labelledby="recent-answers" dir={direction}>
      <div className={isRTL ? "text-right" : "text-left"}>
        <h3
          id="recent-answers"
          className="m-0 text-[1.15rem] font-bold text-[var(--bg-color-header)]"
        >
          {isSearchMode ? t("searchTitle") : t("sectionTitle")}
        </h3>

        <span className="text-[0.95rem] block mt-2">
          {isSearchMode ? (
            <>
              {t("searchResultsFor")} <strong>“{activeSearch}”</strong>
            </>
          ) : (
            <>
              {t("totalAnswers")} {displayedFatwas.length}
            </>
          )}
        </span>

        {isSearchMode && (
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
          initialValue={activeSearch}
          isSearchMode={isSearchMode}
          onSubmit={submitSearch}
          onClear={clearSearch}
        />
      </div>

      <div id="fatwaList">
        {searchLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-[50px] h-[50px] rounded-full animate-spin border-[5px] border-[var(--bg-color-header)] border-t-transparent" />
            <p className="text-[var(--bg-color-header)] font-medium text-[0.95rem]">
              {t("searching")}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <span className="text-[2rem]">⚠️</span>
            <p className="text-red-600 font-semibold text-[1rem]">{error}</p>
          </div>
        ) : paginatedFatwas.length > 0 ? (
          paginatedFatwas.map((item, index) => (
            <QuestionItem
              key={item._id || item.slug || index}
              index={startIndex + index}
              item={item}
              labelPrefix={questionLabel}
              direction={direction}
              locale={locale}
              currentPage={currentPage}
              highlightQuery={activeSearch}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <Inbox size={32} className="text-[var(--bg-color-header)]" />
            <p className="text-[var(--bg-color-header)] font-semibold text-[1rem]">
              {isSearchMode ? t("noResults") : t("noAnswers")}
            </p>

            {isSearchMode && (
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
            )}
          </div>
        )}
      </div>

      <Pagination
        totalItems={totalItemsForPagination}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default RecentAnswers;
