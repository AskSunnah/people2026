// src/services/question.service.js
import { API_BASE } from "@/config";

/**
 * Recent answers for a locale, fetched server-side on the homepage so
 * they're in the initial HTML (SEO). Matches old React app's
 * fetchAllFatwas / fetchAllFatwasArabic.
 */
export async function getRecentAnswers(lang, { revalidate = 300 } = {}) {
  const path = lang === "ar" ? "/api/ar/all" : "/api/all";

  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch answers (${res.status})`);
  }

  return res.json();
}

/**
 * Single question by slug, used by the (upcoming) question detail page.
 * Matches old React app's fetchFatwaBySlug.
 */
export async function getQuestionBySlug(slug, lang = "en") {
  const langPrefix = lang === "ar" ? "/ar" : "";

  const res = await fetch(`${API_BASE}/api${langPrefix}/questions/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;

  return res.json();
}

/**
 * Search, called client-side from the RecentAnswers search box.
 * Matches old React app's searchFatwas.
 */
export async function searchAnswers({
  query,
  page = 1,
  limit = 5,
  lang = "en",
  signal,
}) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
    lang,
  });

  const res = await fetch(`${API_BASE}/api/search?${params.toString()}`, {
    signal,
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Search failed.");
  }

  return data;
}

/**
 * "Ask a question" form submission.
 * Matches old React app's submitQuestion.
 */
export async function submitQuestion({ name, email, question, language = "en" }) {
  const res = await fetch(`${API_BASE}/api/user-questions/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, question, language }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to submit question");
  }

  return data;
}
