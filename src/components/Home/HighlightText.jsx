"use client";

import React from "react";

const TASHKEEL = "[\\u064B-\\u0652\\u0670\\u0640]*";
const STOPWORDS = new Set([
  "me",
  "my",
  "i",
  "a",
  "an",
  "the",
  "of",
  "to",
  "is",
  "it",
  "in",
  "on",
  "and",
  "or",
  "for",
  "do",
  "does",
  "can",
  "how",
  "what",
]);

const escapeRegex = (t = "") => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const stripTashkeel = (t = "") => t.replace(/[\u064B-\u0652\u0670\u0640]/g, "");

function buildWordPattern(word) {
  let p = "";
  for (const ch of word) {
    if ("اأإآٱ".includes(ch)) p += `[اأإآٱ]${TASHKEEL}`;
    else if ("يى".includes(ch)) p += `[يى]${TASHKEEL}`;
    else if ("ةه".includes(ch)) p += `[ةه]${TASHKEEL}`;
    else p += `${escapeRegex(ch)}${TASHKEEL}`;
  }
  return p;
}

// Fallback only (used when the server didn't send ranges).
// Matches at the START of a word, so "me" no longer hits "Fundamental".
function buildHighlightRegex(query = "") {
  const words = [
    ...new Set(
      stripTashkeel(query.trim())
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length >= 3 && !STOPWORDS.has(w)),
    ),
  ].sort((a, b) => b.length - a.length);

  if (!words.length) return null;

  const body = words.map(buildWordPattern).join("|");
  // capture group => odd indexes of split() are matches
  return new RegExp(`(?<![\\p{L}\\p{N}])(${body})[\\p{L}\\p{N}]*`, "giu");
}

const Mark = ({ children }) => (
  <mark className="rounded bg-[#fff0a8] px-1 font-semibold text-[#3a2c0f]">
    {children}
  </mark>
);

/**
 * Props:
 *  - text:   string to render
 *  - ranges: [[start, end], ...] from the server (preferred, exact)
 *  - query:  fallback client-side highlighting when ranges is undefined
 */
const HighlightText = ({ text = "", ranges, query = "" }) => {
  if (!text) return null;
  const str = String(text);

  // Preferred path: server-computed ranges
  if (Array.isArray(ranges)) {
    if (!ranges.length) return <>{str}</>;

    const parts = [];
    let last = 0;
    ranges.forEach(([s, e], i) => {
      if (s < last || e > str.length) return; // guard against bad/overlapping ranges
      if (s > last) parts.push(str.slice(last, s));
      parts.push(<Mark key={i}>{str.slice(s, e)}</Mark>);
      last = e;
    });
    if (last < str.length) parts.push(str.slice(last));
    return <>{parts}</>;
  }

  // Fallback path
  if (!query.trim()) return <>{str}</>;
  const regex = buildHighlightRegex(query);
  if (!regex) return <>{str}</>;

  // With the split-capture trick, matches sit at odd indexes
  const pieces = str.split(regex);
  return (
    <>
      {pieces.map((part, i) =>
        i % 2 === 1 ? (
          <Mark key={i}>{part}</Mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

export default HighlightText;
