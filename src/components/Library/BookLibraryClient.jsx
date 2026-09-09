"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import {
  getBooks,
  getBookSuggestions,
  getFuzzyCorrection,
  getBookDownloadUrl,
} from "@/services/library.service";

import BookToolbar from "./BookToolbar";
import BookGrid from "./BookGrid";

const LIMIT = 9;

export default function BookLibraryClient({
  lang = "en",
  initialBooks = [],
  initialHasMore = false,
  initialAuthors = [],
}) {
  const t = useTranslations("library");

  const dir = lang === "ar" ? "rtl" : "ltr";

  // Search
  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [searchFocused, setSearchFocused] = useState(false);

  // Suggestions
  const [suggestions, setSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestAbortRef = useRef(null);

  // Fuzzy
  const [fuzzyCorrection, setFuzzyCorrection] = useState(null);

  const [fuzzyDismissed, setFuzzyDismissed] = useState(false);

  const [fuzzyAccepted, setFuzzyAccepted] = useState(null);

  // Filters
  const [category, setCategory] = useState("all");

  const [author, setAuthor] = useState("all");

  const [sort, setSort] = useState("author_timeline_asc");

  // Initial server data
  const [authorOptions] = useState(initialAuthors);

  const [books, setBooks] = useState(
    initialBooks.map((book) => ({
      ...book,
      category: book.category ? book.category.toLowerCase() : "uncategorized",
    })),
  );

  const [loading, setLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(initialHasMore);

  const firstFetch = useRef(true);

  const isDebouncing =
    search.trim() !== debouncedSearch && search.trim().length >= 2;

  // ─────────────────────────────────────────────
  // Translation-backed options
  // ─────────────────────────────────────────────

  const categoryOptions = [
    {
      value: "all",
      label: t("categories.all"),
    },
    {
      value: "aqeedah",
      label: t("categories.aqeedah"),
    },
    {
      value: "seerah",
      label: t("categories.seerah"),
    },
    {
      value: "hadith",
      label: t("categories.hadith"),
    },
    {
      value: "fiqh",
      label: t("categories.fiqh"),
    },
  ];

  const sortOptions = [
    {
      value: "order",
      label: t("sort.order"),
    },
    {
      value: "newest",
      label: t("sort.newest"),
    },
    {
      value: "oldest",
      label: t("sort.oldest"),
    },
    {
      value: "title_asc",
      label: t("sort.titleAsc"),
    },
    {
      value: "title_desc",
      label: t("sort.titleDesc"),
    },
    {
      value: "author_asc",
      label: t("sort.authorAsc"),
    },
    {
      value: "author_desc",
      label: t("sort.authorDesc"),
    },
    {
      value: "author_timeline_asc",
      label: t("sort.authorTimelineAsc"),
    },
    {
      value: "author_timeline_desc",
      label: t("sort.authorTimelineDesc"),
    },
  ];

  // ─────────────────────────────────────────────
  // Search debounce
  // ─────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      const term = search.trim();

      if (term.length === 0 || term.length >= 2) {
        setDebouncedSearch(term);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // ─────────────────────────────────────────────
  // Suggestions
  // ─────────────────────────────────────────────

  useEffect(() => {
    const term = search.trim();

    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    if (suggestAbortRef.current) {
      suggestAbortRef.current.abort();
    }

    const controller = new AbortController();

    suggestAbortRef.current = controller;

    getBookSuggestions({
      query: term,
      lang,
      signal: controller.signal,
    })
      .then((data) => {
        setSuggestions(Array.isArray(data) ? data : data?.suggestions || []);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          console.error("Suggestion error:", err);
        }
      });

    return () => {
      controller.abort();
    };
  }, [search, lang]);

  // ─────────────────────────────────────────────
  // Fuzzy correction
  // ─────────────────────────────────────────────

  const lookupFuzzy = useCallback(
    async (term) => {
      if (!term || term.length < 2) {
        setFuzzyCorrection(null);
        return;
      }

      try {
        const data = await getFuzzyCorrection({
          query: term,
          lang,
        });

        setFuzzyCorrection(
          typeof data === "string" ? data : data?.correction || null,
        );
      } catch {
        setFuzzyCorrection(null);
      }
    },
    [lang],
  );

  // ─────────────────────────────────────────────
  // Reset pagination when controls change
  // ─────────────────────────────────────────────

  useEffect(() => {
    setPage(1);

    setFuzzyCorrection(null);
    setFuzzyDismissed(false);
    setFuzzyAccepted(null);
  }, [lang, debouncedSearch, category, author, sort]);

  // ─────────────────────────────────────────────
  // Client fetches after initial SSR
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (firstFetch.current) {
      firstFetch.current = false;
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        setError("");

        const data = await getBooks({
          lang,
          page,
          limit: LIMIT,
          search: debouncedSearch,
          category,
          author,
          sort,
        });

        if (cancelled) {
          return;
        }

        const cleaned = (data?.books || []).map((book) => ({
          ...book,
          category: book.category
            ? book.category.toLowerCase()
            : "uncategorized",
        }));

        setBooks((previous) =>
          page === 1 ? cleaned : [...previous, ...cleaned],
        );

        setHasMore(Boolean(data?.hasMore));

        if (
          page === 1 &&
          cleaned.length === 0 &&
          debouncedSearch &&
          !fuzzyDismissed
        ) {
          lookupFuzzy(debouncedSearch);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error("Error loading books:", err);

        setError(
          lang === "ar"
            ? "حدث خطأ أثناء تحميل الكتب."
            : "Something went wrong while loading books.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    lang,
    page,
    debouncedSearch,
    category,
    author,
    sort,
    fuzzyDismissed,
    lookupFuzzy,
  ]);

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  const getCategoryLabel = (value) =>
    categoryOptions.find((option) => option.value === value)?.label ??
    value ??
    "—";

  const getSortLabel = (value) =>
    sortOptions.find((option) => option.value === value)?.label ?? value;

  const handleAuthorChange = (value) => {
    setAuthor(value);

    if (value !== "all") {
      setSearch("");
      setDebouncedSearch("");
      setSuggestions([]);
      setFuzzyAccepted(null);
    }
  };

  const resetFilters = () => {
    setCategory("all");
    setAuthor("all");
    setSort("author_timeline_asc");

    setSearch("");
    setDebouncedSearch("");

    setFuzzyCorrection(null);
    setFuzzyDismissed(false);
    setFuzzyAccepted(null);

    setSuggestions([]);
  };

  const handleSuggestionSelect = (suggestion) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setFuzzyAccepted(null);

    if (suggestion.type === "category") {
      setCategory(suggestion.value);

      setSearch("");
      setDebouncedSearch("");
    } else {
      setSearch(suggestion.label);

      setDebouncedSearch(suggestion.label);
    }
  };

  const handleFuzzyAccept = (correction) => {
    setSearch(correction);
    setDebouncedSearch(correction);

    setFuzzyAccepted(correction);

    setFuzzyCorrection(null);
    setFuzzyDismissed(false);
  };

  const handleFuzzyDismiss = () => {
    setFuzzyDismissed(true);
    setFuzzyAccepted(null);
    setFuzzyCorrection(null);
  };

  const handleDownload = async (bookId) => {
    try {
      const result = await getBookDownloadUrl(bookId);

      const downloadUrl =
        typeof result === "string" ? result : result?.downloadUrl;

      if (!downloadUrl) {
        alert(
          lang === "ar"
            ? "لا يتوفر رابط تحميل لهذا الكتاب."
            : "No download link available for this book.",
        );

        return;
      }

      window.location.href = downloadUrl;
    } catch {
      alert(
        lang === "ar"
          ? "حدث خطأ أثناء التحميل."
          : "Something went wrong while downloading.",
      );
    }
  };

  const hasActiveFilters =
    category !== "all" || author !== "all" || sort !== "author_timeline_asc";

  const hasAnyActiveState = hasActiveFilters || Boolean(debouncedSearch);

  return (
    <div
      dir={dir}
      className="m-0 font-[var(--font-family)] flex-1"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.3)),url("/books.jpeg")',
        backgroundSize: "auto",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-[1090px] mx-auto my-8 p-6 rounded-[12px] bg-[var(--bg-light)] text-[var(--text-main)]">
        <BookToolbar
          lang={lang}
          dir={dir}
          t={t}
          search={search}
          setSearch={setSearch}
          debouncedSearch={debouncedSearch}
          setDebouncedSearch={setDebouncedSearch}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          isDebouncing={isDebouncing}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          category={category}
          setCategory={setCategory}
          author={author}
          handleAuthorChange={handleAuthorChange}
          sort={sort}
          setSort={setSort}
          categoryOptions={categoryOptions}
          authorOptions={authorOptions}
          sortOptions={sortOptions}
          fuzzyAccepted={fuzzyAccepted}
          setFuzzyAccepted={setFuzzyAccepted}
          hasAnyActiveState={hasAnyActiveState}
          loading={loading}
          getCategoryLabel={getCategoryLabel}
          getSortLabel={getSortLabel}
          resetFilters={resetFilters}
          handleSuggestionSelect={handleSuggestionSelect}
        />

        <BookGrid
          lang={lang}
          t={t}
          books={books}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          hasMore={hasMore}
          hasAnyActiveState={hasAnyActiveState}
          hasActiveFilters={hasActiveFilters}
          fuzzyAccepted={fuzzyAccepted}
          fuzzyCorrection={fuzzyCorrection}
          debouncedSearch={debouncedSearch}
          search={search}
          onFuzzyDismiss={handleFuzzyDismiss}
          onFuzzyAccept={handleFuzzyAccept}
          onReset={resetFilters}
          getCategoryLabel={getCategoryLabel}
          onDownload={handleDownload}
          onViewMore={() => {
            setPage((previous) => previous + 1);
          }}
        />
      </div>
    </div>
  );
}
