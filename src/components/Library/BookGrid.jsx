"use client";

import BookCard from "./BookCard";

function FuzzyBanner({ correction, originalTerm, lang, onDismiss, t }) {
  if (!correction) {
    return null;
  }

  return (
    <div className="flex items-center gap-2.5 mb-4 px-3.5 py-2.5 rounded-[8px] bg-[#fef9ed] border border-[#e8c84a]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 shrink-0 text-[#c9a227]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>

      <p className="text-[0.8rem] text-[#7a5000] flex-1">
        {t("books.showingResultsFor")}: "{correction}"
      </p>

      <button
        type="button"
        onClick={onDismiss}
        className="text-[0.75rem] text-[#a07820] hover:text-[#c9a227] font-medium transition-colors underline underline-offset-2"
      >
        {lang === "ar"
          ? `بحث عن "${originalTerm}"`
          : `Search for "${originalTerm}" instead`}
      </button>
    </div>
  );
}

function EmptyState({
  hasActiveFilters,
  debouncedSearch,
  fuzzyCorrection,
  onReset,
  onFuzzyAccept,
  t,
}) {
  const hasAnyState = hasActiveFilters || Boolean(debouncedSearch);

  const showDidYouMean = Boolean(fuzzyCorrection) && Boolean(debouncedSearch);

  return (
    <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#fef3c7] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-[#c9a227]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>

      <p className="text-[1.05rem] font-semibold text-[var(--text-main)]">
        {t("books.noBooks")}
      </p>

      {showDidYouMean && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-[0.82rem] text-[var(--text-secondary)]">
            {t("books.noExactMatch")}
          </p>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[0.82rem] text-[var(--text-secondary)]">
              {t("books.didYouMean")}
            </span>

            <button
              type="button"
              onClick={() => {
                onFuzzyAccept(fuzzyCorrection);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#c9a227] text-[#3a2000] rounded-full text-[0.82rem] font-bold hover:opacity-90 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>

              {fuzzyCorrection}
            </button>
          </div>
        </div>
      )}

      {hasAnyState && (
        <button
          type="button"
          onClick={onReset}
          className="mt-1 text-[0.82rem] font-semibold text-[#1f6f3e] hover:underline"
        >
          {t("books.resetFilters")}
        </button>
      )}
    </div>
  );
}

export default function BookGrid({
  lang,
  t,

  books,
  loading,
  loadingMore,
  error,
  hasMore,

  hasAnyActiveState,
  hasActiveFilters,

  fuzzyAccepted,
  fuzzyCorrection,
  debouncedSearch,
  search,

  onFuzzyDismiss,
  onFuzzyAccept,
  onReset,

  getCategoryLabel,
  onDownload,

  onViewMore,
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-[64px] h-[64px] rounded-full animate-spin border-[6px] border-[var(--bg-color-header)] border-t-[var(--text-accent)]" />

        <p className="mt-4 text-[var(--text-main)] font-medium">
          {t("books.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 font-medium">{error}</div>
    );
  }

  if (books.length === 0) {
    return (
      <EmptyState
        hasActiveFilters={hasActiveFilters}
        debouncedSearch={debouncedSearch}
        fuzzyCorrection={fuzzyCorrection}
        onReset={onReset}
        onFuzzyAccept={onFuzzyAccept}
        t={t}
      />
    );
  }

  return (
    <>
      {fuzzyAccepted && (
        <FuzzyBanner
          correction={fuzzyAccepted}
          originalTerm={search}
          lang={lang}
          onDismiss={onFuzzyDismiss}
          t={t}
        />
      )}

      {hasAnyActiveState && (
        <p className="text-[0.75rem] text-white font-medium mb-4">
          {t("books.showingBooks", {
            count: books.length,
          })}
          {hasMore ? "+" : ""}
        </p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
        {books.map((book) => (
          <BookCard
            key={book.slug}
            book={book}
            getCategoryLabel={getCategoryLabel}
            onDownload={onDownload}
            t={t}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={onViewMore}
            disabled={loadingMore}
            className="lib-button min-w-[150px] h-[44px] px-6 font-semibold rounded-[6px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingMore ? t("books.loadingMore") : t("books.viewMore")}
          </button>
        </div>
      )}
    </>
  );
}
