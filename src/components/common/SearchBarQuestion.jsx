"use client";

// src/components/common/SearchBarQuestion.jsx
import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

const RECENT_KEY_PREFIX = "recentQuestionSearches:";
const MAX_RECENT = 5;

function loadRecent(lang) {
  try {
    const raw = localStorage.getItem(`${RECENT_KEY_PREFIX}${lang}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(lang, query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return loadRecent(lang);

  const existing = loadRecent(lang).filter(
    (q) => q.toLowerCase() !== cleanQuery.toLowerCase(),
  );

  const next = [cleanQuery, ...existing].slice(0, MAX_RECENT);

  try {
    localStorage.setItem(`${RECENT_KEY_PREFIX}${lang}`, JSON.stringify(next));
  } catch {
    // ignore localStorage errors
  }

  return next;
}

const SearchBarQuestion = ({
  direction = "ltr",
  placeholder = "Search Questions...",
  initialValue = "",
  onSubmit,
  onClear,
  isSearchMode = false,
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);

  const boxRef = useRef(null);

  const isRTL = direction === "rtl";
  const lang = isRTL ? "ar" : "en";

  useEffect(() => {
    setSearchText(initialValue || "");
  }, [initialValue]);

  useEffect(() => {
    setRecentSearches(loadRecent(lang));
  }, [lang]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowRecent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submit = (value = searchText) => {
    const query = value.trim();

    setShowRecent(false);

    if (!query) {
      clearSearch();
      return;
    }

    setRecentSearches(saveRecent(lang, query));
    onSubmit(query);
  };

  const clearSearch = () => {
    setSearchText("");
    setShowRecent(false);
    onClear?.();
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();

    try {
      localStorage.removeItem(`${RECENT_KEY_PREFIX}${lang}`);
    } catch {
      // ignore
    }

    setRecentSearches([]);
    setShowRecent(false);
  };

  const handleRecentClick = (query) => {
    setSearchText(query);
    submit(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") setShowRecent(false);
  };

  return (
    <div
      ref={boxRef}
      className="
        relative w-full rounded-xl border border-[#e6dcc5]
        bg-[#fffdf8] px-3 py-3 sm:px-4
        shadow-[0_4px_14px_rgba(0,0,0,0.05)]
        focus-within:border-[var(--bg-color-header)]
        transition-all
      "
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <Search size={17} className="text-[var(--bg-color-header)] shrink-0" />

        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => {
            if (!searchText.trim() && recentSearches.length > 0) {
              setShowRecent(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          dir={direction}
          autoComplete="off"
          className={`
            min-w-0 flex-1 bg-transparent
            text-[0.9rem] sm:text-base
            outline-none placeholder:text-[#9a8f7a]
            ${isRTL ? "text-right" : "text-left"}
          `}
        />

        {(searchText || isSearchMode) && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label={isRTL ? "مسح البحث" : "Clear search"}
            className="
              shrink-0 rounded-full bg-[#f3ead6]
              text-[var(--bg-color-header)]
              w-8 h-8 flex items-center justify-center
              hover:bg-[#ead9b5] transition
            "
          >
            <X size={15} />
          </button>
        )}

        <button
          type="button"
          onClick={() => submit()}
          className="
            shrink-0 rounded-full bg-[var(--bg-color-header)]
            text-white text-[0.78rem] sm:text-[0.85rem]
            px-3 sm:px-4 py-2 font-medium
            hover:brightness-110 transition
          "
        >
          {isRTL ? "بحث" : "Search"}
        </button>
      </div>

      {showRecent && recentSearches.length > 0 && (
        <div
          className={`
            absolute left-3 right-3 top-[calc(100%+6px)] z-30
            overflow-hidden rounded-xl border border-[#eadfca] bg-white
            shadow-[0_10px_30px_rgba(0,0,0,0.12)]
            ${isRTL ? "text-right" : "text-left"}
          `}
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span className="text-[0.78rem] font-semibold text-[#9a8f7a]">
              {isRTL ? "آخر ٥ عمليات بحث" : "Last 5 searches"}
            </span>

            <button
              type="button"
              onClick={clearRecentSearches}
              className="
                text-[0.75rem] text-[#9a8f7a]
                hover:text-[var(--bg-color-header)] transition
              "
            >
              {isRTL ? "مسح" : "Clear"}
            </button>
          </div>

          {recentSearches.map((query, index) => (
            <button
              key={`${query}-${index}`}
              type="button"
              onClick={() => handleRecentClick(query)}
              className={`
                block w-full px-4 py-2.5 text-[0.9rem]
                text-[#3a2c0f] hover:bg-[#fff7e6]
                ${isRTL ? "text-right" : "text-left"}
              `}
            >
              {query}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBarQuestion;
