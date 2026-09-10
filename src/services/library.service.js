import { API_BASE } from "@/config";

function ensureApiBase() {
  if (!API_BASE) {
    throw new Error("Library API base URL is not configured.");
  }

  return API_BASE.replace(/\/$/, "");
}

export async function getBooks({
  lang = "en",
  page = 1,
  limit = 9,
  search = "",
  category = "all",
  author = "all",
  sort = "author_timeline_asc",
  signal,
  revalidate,
} = {}) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search) params.set("search", search);
  if (category && category !== "all") {
    params.set("category", category);
  }
  if (author && author !== "all") {
    params.set("author", author);
  }
  if (sort) params.set("sort", sort);

  const endpoint = lang === "ar" ? "ar" : "en";

  const fetchOptions = {};

  if (signal) {
    fetchOptions.signal = signal;
  }

  if (typeof revalidate === "number") {
    fetchOptions.next = { revalidate };
  }

  const res = await fetch(
    `${ensureApiBase()}/api/books/${endpoint}?${params.toString()}`,
    fetchOptions,
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch books (${res.status})`);
  }

  return res.json();
}

export async function getAuthors(lang = "en", options = {}) {
  const endpoint = lang === "ar" ? "ar" : "en";

  const fetchOptions = {};

  if (options.signal) {
    fetchOptions.signal = options.signal;
  }

  if (typeof options.revalidate === "number") {
    fetchOptions.next = {
      revalidate: options.revalidate,
    };
  }

  const res = await fetch(
    `${ensureApiBase()}/api/books/authors/${endpoint}`,
    fetchOptions,
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch authors (${res.status})`);
  }

  const data = await res.json();

  return data.authors || [];
}

export async function getBook(lang, slug, options = {}) {
  if (!slug) {
    throw new Error("Book slug is required.");
  }

  const endpoint = lang === "ar" ? "ar" : "en";

  const fetchOptions = {};

  if (typeof options.revalidate === "number") {
    fetchOptions.next = {
      revalidate: options.revalidate,
    };
  }

  const res = await fetch(
    `${ensureApiBase()}/api/books/${endpoint}/${encodeURIComponent(slug)}`,
    fetchOptions,
  );

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    throw new Error(`Failed to fetch book (${res.status})`);
  }

  const data = await res.json();

  return data.book || null;
}

export async function getBookSuggestions({ query, lang = "en", signal }) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    q: query.trim(),
    lang,
  });

  const res = await fetch(
    `${ensureApiBase()}/api/books/suggestions?${params.toString()}`,
    {
      signal,
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch suggestions (${res.status})`);
  }

  const data = await res.json();

  return data.suggestions || [];
}

export async function getFuzzyCorrection({ query, lang = "en" }) {
  if (!query || query.trim().length < 2) {
    return null;
  }

  const params = new URLSearchParams({
    q: query.trim(),
    lang,
  });

  const res = await fetch(
    `${ensureApiBase()}/api/books/fuzzy?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch fuzzy correction (${res.status})`);
  }

  const data = await res.json();

  return data.correction || null;
}

export async function getBookDownloadUrl(bookId) {
  if (!bookId) {
    throw new Error("Book ID is required.");
  }

  const res = await fetch(
    `${ensureApiBase()}/api/books/${encodeURIComponent(bookId)}/download`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to get download URL (${res.status})`);
  }

  const data = await res.json();

  return data.downloadUrl || null;
}
