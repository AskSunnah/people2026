import { API_BASE } from "@/config";

// Reusable GET request for public category endpoints
async function fetchCategoryAPI(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    next: { revalidate: 300 },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch category data");
  }

  return res.json();
}

// Get all active categories
// tree=true returns parent categories with nested children
export async function getCategories(lang = "en", tree = false) {
  const params = new URLSearchParams({
    lang,
    tree: String(tree),
  });

  const result = await fetchCategoryAPI(
    `/api/qa-categories?${params.toString()}`,
  );

  if (!result?.success) {
    throw new Error("Failed to fetch categories");
  }

  return result.categories;
}

// Get questions belonging to a category
// Example path: "prayer/purification"
export async function getCategoryQuestions(
  lang = "en",
  path,
  page = 1,
  limit = 12,
) {
  const params = new URLSearchParams({
    lang,
    path,
    page: String(page),
    limit: String(limit),
  });

  const result = await fetchCategoryAPI(
    `/api/qa-categories/questions?${params.toString()}`,
  );

  if (result === null) {
    return null;
  }

  if (!result?.success) {
    throw new Error("Failed to fetch category questions");
  }

  return result;
}
