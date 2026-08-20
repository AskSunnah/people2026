"use client";

// src/components/Question/ShareButton.jsx
import { Share2 } from "lucide-react";

export default function ShareButton({ heading, shareText, copiedMessage }) {
  const handleShare = async () => {
    const url = window.location.href;
    const shareData = { title: heading || "", text: shareText, url };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        alert(copiedMessage);
      }
    } catch {
      // Share cancelled by user — nothing to do.
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Share"
      className="
        px-3 py-2 rounded-lg border border-[rgba(40,115,70,0.25)]
        flex items-center justify-center
        text-[var(--bg-color-header)]
        hover:bg-[rgba(40,115,70,0.08)]
        transition-all
      "
    >
      <Share2 size={17} />
    </button>
  );
}
