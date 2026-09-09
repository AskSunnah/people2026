"use client";

import { useState } from "react";
import CustomSelect from "./CustomSelect";

function SuggestionIcon({ type }) {
  if (type === "author") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 shrink-0 text-[#c9a227]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.121 17.804A4 4 0 018 17h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    );
  }

  if (type === "category") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 shrink-0 text-[#c9a227]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 7h.01M7 3h5l5.586 5.586a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-5-5A2 2 0 013 11.586V7a4 4 0 014-4z"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5 shrink-0 text-[#c9a227]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function SearchSuggestions({ suggestions, onSelect, dir, visible, lang }) {
  if (!visible || !suggestions.length) {
    return null;
  }

  const typeLabel = (type) => {
    if (dir === "rtl") {
      if (type === "author") return "مؤلف";
      if (type === "category") return "تصنيف";
      return "كتاب";
    }

    if (type === "author") return "Author";
    if (type === "category") return "Category";
    return "Book";
  };

  return (
    <div
      className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white border border-[#e6dcc5] rounded-[10px] shadow-[0_6px_24px_rgba(0,0,0,0.13)] overflow-hidden"
      dir={dir}
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={`${suggestion.type}-${suggestion.value || suggestion.label}-${index}`}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(suggestion);
          }}
          className={`w-full flex items-center gap-2.5 px-3.5 py-[9px] ${
            dir === "rtl" ? "text-right" : "text-left"
          } hover:bg-[#fef9ed] transition-colors border-b border-[#f5f0e5] last:border-0`}
        >
          <SuggestionIcon type={suggestion.type} />

          <span
            className={`flex-1 text-[13px] text-[#3a2000] font-medium truncate ${
              dir === "rtl" ? "text-right" : "text-left"
            }`}
          >
            {suggestion.label}
          </span>

          <span className="text-[10.5px] text-[#c4b08a] font-medium shrink-0">
            {typeLabel(suggestion.type)}
          </span>
        </button>
      ))}
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.73rem] font-medium bg-[#fff7e0] text-[#7a5000] border border-[#e8c84a] px-2.5 py-[3px] rounded-full">
      {label}

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="text-[#a07820] hover:text-[#c9a227] transition-colors leading-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-2.5 h-2.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
}

export default function BookToolbar({
  lang,
  dir,
  t,

  search,
  setSearch,
  debouncedSearch,
  setDebouncedSearch,
  searchFocused,
  setSearchFocused,
  isDebouncing,

  suggestions,
  showSuggestions,
  setShowSuggestions,

  category,
  setCategory,

  author,
  handleAuthorChange,

  sort,
  setSort,

  categoryOptions,
  authorOptions,
  sortOptions,

  fuzzyAccepted,
  setFuzzyAccepted,

  hasAnyActiveState,
  loading,

  getCategoryLabel,
  getSortLabel,
  resetFilters,

  handleSuggestionSelect,
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
        <div className="relative w-full lg:flex-[0_0_42%] xl:flex-[0_0_48%]">
          <div
            className={`
              flex items-center gap-2.5
              rounded-[10px] border bg-white
              px-4 h-[44px] transition-all duration-200
              ${
                searchFocused
                  ? "border-[#c9a227] ring-2 ring-[#c9a227]/20 shadow-[0_0_0_3px_rgba(201,162,39,0.10)]"
                  : "border-[#e6dcc5] shadow-sm"
              }
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-[15px] h-[15px] shrink-0 transition-colors duration-200 ${
                searchFocused ? "text-[#c9a227]" : "text-[#b8a98a]"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
                setFuzzyAccepted(null);

                if (author !== "all") {
                  handleAuthorChange("all");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setDebouncedSearch(search.trim());
                  setShowSuggestions(false);
                }

                if (e.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => {
                setSearchFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setSearchFocused(false);

                setTimeout(() => {
                  setShowSuggestions(false);
                }, 120);
              }}
              placeholder={t("books.searchPlaceholder")}
              dir={dir}
              autoComplete="off"
              className={`flex-1 min-w-0 bg-transparent text-[0.875rem] text-[#3a2000] outline-none placeholder:text-[#c4b69a] ${
                lang === "ar" ? "text-right" : "text-left"
              }`}
            />

            {isDebouncing && (
              <span className="shrink-0 flex items-center gap-1.5 text-[0.68rem] text-[#b8a064] font-medium">
                <span className="w-[5px] h-[5px] rounded-full bg-[#c9a227] animate-pulse inline-block" />

                {t("books.searching")}
              </span>
            )}

            {search && !isDebouncing && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setFuzzyAccepted(null);
                }}
                aria-label={t("books.clearSearch")}
                className="shrink-0 w-5 h-5 flex items-center justify-center text-[#b8a98a] hover:text-[#c9a227] transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setDebouncedSearch(search.trim());
                setShowSuggestions(false);
              }}
              className="shrink-0 h-[30px] px-4 rounded-full bg-[#c9a227] text-[#3a2000] text-[0.75rem] font-semibold hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              {t("books.search")}
            </button>
          </div>

          <SearchSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            dir={dir}
            visible={showSuggestions && suggestions.length > 0}
            lang={lang}
          />
        </div>

        <div className="flex items-center gap-2 flex-1 flex-nowrap">
          <CustomSelect
            value={category}
            onChange={setCategory}
            placeholder={getCategoryLabel("all")}
            options={categoryOptions}
            dir={dir}
            minWidth="0"
            maxWidth="100%"
          />

          <CustomSelect
            value={author}
            onChange={handleAuthorChange}
            placeholder={t("books.allAuthors")}
            options={[
              {
                value: "all",
                label: t("books.allAuthors"),
              },
              ...authorOptions.map((name) => ({
                value: name,
                label: name,
              })),
            ]}
            showSearch
            searchPlaceholder={t("books.filterAuthors")}
            dir={dir}
            minWidth="0"
            maxWidth="100%"
          />

          <CustomSelect
            value={sort}
            onChange={setSort}
            placeholder={getSortLabel("order")}
            groups={[
              {
                label: lang === "ar" ? "الترتيب" : "Order",
                options: sortOptions.slice(0, 3),
              },
              {
                label: lang === "ar" ? "العنوان" : "Title",
                options: sortOptions.slice(3, 5),
              },
              {
                label: lang === "ar" ? "المؤلف" : "Author",
                options: sortOptions.slice(5),
              },
            ]}
            dir={dir}
            minWidth="0"
            maxWidth="none"
            dropdownWidth="135px"
          />
        </div>
      </div>

      {hasAnyActiveState && !loading && (
        <div className="mb-5">
          <div className="flex items-center mb-2">
            <span className="text-[0.7rem] text-white font-semibold uppercase tracking-wide">
              {t("books.activeFilters")}
            </span>

            <button
              type="button"
              onClick={resetFilters}
              className={`
                inline-flex items-center gap-1.5
                px-3 py-1.5
                rounded-full
                text-[0.72rem]
                font-semibold
                text-[#1f6f3e]
                bg-[#eef9f1]
                border border-[#cfe8d6]
                hover:bg-[#e2f5e8]
                hover:border-[#1f6f3e]
                transition-all duration-200
                ${dir === "rtl" ? "mr-auto" : "ml-auto"}
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>

              {t("books.clearAll")}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {debouncedSearch && (
              <FilterChip
                label={`"${fuzzyAccepted || debouncedSearch}"`}
                onRemove={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setFuzzyAccepted(null);
                }}
              />
            )}

            {category !== "all" && (
              <FilterChip
                label={getCategoryLabel(category)}
                onRemove={() => {
                  setCategory("all");
                }}
              />
            )}

            {author !== "all" && (
              <FilterChip
                label={author}
                onRemove={() => {
                  handleAuthorChange("all");
                }}
              />
            )}

            {sort !== "order" && (
              <FilterChip
                label={getSortLabel(sort)}
                onRemove={() => {
                  setSort("order");
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
