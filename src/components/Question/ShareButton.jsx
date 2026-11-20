"use client";

// src/components/Question/ShareButton.jsx
import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({
  heading,
  shareText,
  copiedMessage,
  url: urlProp,
  variant = "icon",
  label = "Share",
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    let url;
    if (urlProp) {
      url = new URL(urlProp, window.location.origin).toString();
    } else {
      const u = new URL(window.location.href);
      u.search = "";
      u.hash = "";
      url = u.toString();
    }
    const shareData = { title: heading || "", text: shareText, url };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      throw new Error("no-share");
    } catch (err) {
      if (err?.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  const message = (
    <span
      role="status"
      aria-live="polite"
      className={
        variant === "icon" && copied
          ? "pointer-events-none absolute start-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white rtl:translate-x-1/2"
          : "sr-only"
      }
    >
      {copied ? copiedMessage : ""}
    </span>
  );

  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={heading ? `${label}: ${heading}` : label}
        className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0
          text-[0.75rem] text-[var(--bg-color-header)] hover:underline
          focus-visible:outline-2 focus-visible:outline-[#c8aa35]"
      >
        {copied ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Share2 size={14} aria-hidden="true" />
        )}
        <span>{copied ? copiedMessage || label : label}</span>
        {message}
      </button>
    );
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={handleShare}
        aria-label={label}
        className="
          px-3 py-2 rounded-lg border border-[rgba(40,115,70,0.25)]
          flex items-center justify-center
          text-[var(--bg-color-header)]
          hover:bg-[rgba(40,115,70,0.08)]
          transition-all
          focus-visible:outline-2 focus-visible:outline-[#c8aa35]
        "
      >
        {copied ? <Check size={17} /> : <Share2 size={17} />}
      </button>
      {message}
    </span>
  );
}
