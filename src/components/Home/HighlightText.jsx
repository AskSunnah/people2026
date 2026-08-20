"use client";

import React from "react";

const ARABIC_TASHKEEL = "[ًٌٍَُِّْ]*";

function escapeRegex(text = "") {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeArabicTashkeel(text = "") {
  return text.replace(/[ًٌٍَُِّْ]/g, "");
}

function buildWordPattern(word = "") {
  let pattern = "";

  for (const char of word) {
    if (["ا", "أ", "إ", "آ"].includes(char)) {
      pattern += `[اأإآ]${ARABIC_TASHKEEL}`;
    } else if (["ي", "ى"].includes(char)) {
      pattern += `[يى]${ARABIC_TASHKEEL}`;
    } else if (["ة", "ه"].includes(char)) {
      pattern += `[ةه]${ARABIC_TASHKEEL}`;
    } else {
      pattern += `${escapeRegex(char)}${ARABIC_TASHKEEL}`;
    }
  }

  return pattern;
}

function buildHighlightRegex(query = "") {
  const cleaned = removeArabicTashkeel(query.trim());

  if (!cleaned) return null;

  const words = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (words.length === 0) return null;

  const patterns = words.map(buildWordPattern);

  return new RegExp(`(${patterns.join("|")})`, "gi");
}

const HighlightText = ({ text = "", query = "" }) => {
  if (!query.trim() || !text) return <>{text}</>;

  const regex = buildHighlightRegex(query);

  if (!regex) return <>{text}</>;

  const parts = String(text).split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = regex.test(part);
        regex.lastIndex = 0;

        return isMatch ? (
          <mark
            key={index}
            className="
              bg-[#fff0a8]
              text-[#3a2c0f]
              px-1 rounded
              font-semibold
            "
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        );
      })}
    </>
  );
};

export default HighlightText;
