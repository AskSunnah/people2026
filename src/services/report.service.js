// src/services/report.service.js
import { API_BASE } from "@/config";

// User-facing report submission. Matches your old src/api/reports.js.
export const submitReport = async ({
  contentType,
  lang,
  slug,
  bookId,
  chapterNumber,
  pageNumber,
  reportedText,
  reason,
  email,
}) => {
  const res = await fetch(`${API_BASE}/api/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contentType,
      lang,
      slug,
      bookId,
      chapterNumber,
      pageNumber,
      reportedText,
      reason,
      email,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to submit report.");
  }

  return data;
};
