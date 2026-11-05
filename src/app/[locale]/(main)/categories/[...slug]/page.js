import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import {
  getCategories,
  getCategoryQuestions,
} from "@/services/category.service";
import { buildMetadata, SITE_URL } from "@/lib/seo";

// Safely read page number
function getPageNumber(searchParams = {}) {
  const raw = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;

  const number = Number(raw || 1);

  return Number.isSafeInteger(number) && number > 0 ? number : 1;
}

// Find a category within the category tree
function findCategory(tree, path) {
  for (const category of tree) {
    if (category.path === path) return category;

    const child = findCategory(category.children || [], path);
    if (child) return child;
  }

  return null;
}

// Build breadcrumb items from real category names
function getBreadcrumbs(tree, path) {
  const segments = path.split("/");
  const breadcrumbs = [];

  for (let i = 0; i < segments.length; i++) {
    const currentPath = segments.slice(0, i + 1).join("/");
    const category = findCategory(tree, currentPath);

    if (category) {
      breadcrumbs.push({
        name: category.name,
        path: category.path,
      });
    }
  }

  return breadcrumbs;
}

// Dynamic SEO metadata
export async function generateMetadata({ params, searchParams }) {
  const { locale, slug } = await params;
  const query = await searchParams;

  const path = slug.join("/");
  const page = getPageNumber(query);

  const result = await getCategoryQuestions(locale, path, page, 12);

  if (!result?.success) {
    notFound();
  }

  const { category, pagination } = result;

  if (page > 1 && page > pagination.totalPages) {
    notFound();
  }

  const title = category.name;

  const description =
    category.description?.trim() ||
    (locale === "ar"
      ? `تصفح الأسئلة والأجوبة الإسلامية المتعلقة بموضوع ${category.name} على موقع اسأل السنة.`
      : `Explore Islamic questions and answers about ${category.name}, based on the Qur'an and Sunnah.`);

  const baseMetadata = buildMetadata({
    locale,
    path: `/categories/${category.path}`,
    title: page > 1 ? `${title} - Page ${page}` : title,
    description,
  });

  // Give paginated pages their own canonical URL.
  // Reuse the existing helper's canonical as the base.
  const baseCanonical = baseMetadata.alternates?.canonical;

  const canonicalUrl = baseCanonical
    ? new URL(String(baseCanonical), SITE_URL)
    : null;

  if (canonicalUrl && page > 1) {
    canonicalUrl.searchParams.set("page", String(page));
  }

  return {
    ...baseMetadata,
    alternates: {
      ...baseMetadata.alternates,
      ...(canonicalUrl ? { canonical: canonicalUrl.toString() } : {}),
      // Category translations don't yet have a mapping.
      // Don't assume English/Arabic paths are identical.
      languages: undefined,
    },
    // Avoid indexing empty category landing pages.
    ...(pagination.total === 0
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
  };
}

export default async function CategoryDetailPage({ params, searchParams }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const query = await searchParams;
  const page = getPageNumber(query);
  const path = slug.join("/");
  const isArabic = locale === "ar";

  const [result, categories] = await Promise.all([
    getCategoryQuestions(locale, path, page, 12),
    getCategories(locale, true),
  ]);

  if (!result?.success) notFound();

  const { category, questions, pagination } = result;

  if (page > 1 && page > pagination.totalPages) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbs(categories, path);

  const currentCategory = findCategory(categories, path);
  const children = currentCategory?.children || [];

  const categoryUrl = `/${locale}/categories/${category.path}`;

  const pageUrl = (number) =>
    number === 1 ? categoryUrl : `${categoryUrl}?page=${number}`;

  return (
    <div
      className="
        mx-auto my-8 max-w-[900px] rounded-[10px]
        bg-[var(--bg-main)] px-6 py-8
        text-[var(--text-main)]
        shadow-[2px_3px_12px_rgba(0,0,0,0.14)]
        max-md:mx-4 max-md:px-4
      "
    >
      {/* Breadcrumb navigation */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center
          gap-2 text-sm text-gray-500"
      >
        <Link
          href={`/${locale}/categories`}
          className="hover:text-[var(--bg-color-header)]"
        >
          {isArabic ? "التصنيفات" : "Categories"}
        </Link>

        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="flex items-center gap-2">
            <span>/</span>

            {index === breadcrumbs.length - 1 ? (
              <span
                className="font-medium
                  text-[var(--bg-color-header)]"
                aria-current="page"
              >
                {crumb.name}
              </span>
            ) : (
              <Link
                href={`/${locale}/categories/${crumb.path}`}
                className="hover:text-[var(--bg-color-header)]"
              >
                {crumb.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Category heading */}
      <header className="mb-7">
        <h1
          className="mb-3 text-2xl font-bold
            text-[var(--bg-color-header)]"
        >
          {category.name}
        </h1>

        <p className="text-sm leading-7 text-[var(--text-main)]">
          {category.description?.trim() ||
            (isArabic
              ? `تصفح الأسئلة والأجوبة المتعلقة بموضوع ${category.name}.`
              : `Explore Islamic questions and answers about ${category.name}, based on the Qur'an and Sunnah.`)}
        </p>

        <p className="mt-3 text-sm text-gray-500">
          {pagination.total}{" "}
          {isArabic
            ? "سؤال"
            : pagination.total === 1
              ? "question"
              : "questions"}
        </p>
      </header>

      {/* Child categories */}
      {children.length > 0 && (
        <section className="mb-8">
          <h2
            className="mb-3 text-lg font-semibold
              text-[var(--bg-color-header)]"
          >
            {isArabic ? "التصنيفات الفرعية" : "Subcategories"}
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {children.map((child) => (
              <Link
                key={child._id}
                href={`/${locale}/categories/${child.path}`}
                className="flex items-center justify-between
                  rounded-lg border border-[#e9dfbd]
                  bg-white p-3 transition-colors
                  hover:border-[#c8aa35]
                  hover:bg-[#fff9e9]"
              >
                <span className="text-sm font-medium">{child.name}</span>

                <span className="text-xs text-gray-500">
                  {child.questionCount || 0}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Questions */}
      <section>
        <h2
          className="mb-4 text-lg font-semibold
            text-[var(--bg-color-header)]"
        >
          {isArabic ? "الأسئلة في هذا التصنيف" : "Questions in this Category"}
        </h2>

        {questions.length === 0 ? (
          <p className="rounded-lg bg-white p-5 text-sm text-gray-500">
            {isArabic
              ? "لا توجد أسئلة في هذا التصنيف حتى الآن."
              : "No questions available in this category yet."}
          </p>
        ) : (
          <ol className="space-y-3" start={(page - 1) * pagination.limit + 1}>
            {questions.map((question, index) => (
              <li key={question._id}>
                <Link
                  href={`/${locale}/questions/${question.slug}`}
                  className="group flex items-start gap-3
                    rounded-lg border border-[#e9dfbd]
                    bg-white p-4
                    transition-colors
                    hover:border-[#c8aa35]
                    hover:bg-[#fff9e9]"
                >
                  <span
                    className="flex h-8 w-8 shrink-0
                      items-center justify-center
                      rounded-md bg-[#fff5d2]
                      text-xs font-semibold text-[#a88700]"
                  >
                    {(page - 1) * pagination.limit + index + 1}
                  </span>

                  <span className="flex-1 text-sm font-medium leading-6">
                    {question.heading || question.question}
                  </span>

                  <span className="text-[#c8aa35]">{isArabic ? "←" : "→"}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex items-center
            justify-between gap-4 border-t
            border-[#e9dfbd] pt-5"
        >
          {page > 1 ? (
            <Link
              href={pageUrl(page - 1)}
              className="rounded-lg border
                border-[#e9dfbd] bg-white px-4 py-2
                text-sm hover:bg-[#fff9e9]"
            >
              {isArabic ? "السابق" : "← Previous"}
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-gray-500">
            {page} / {pagination.totalPages}
          </span>

          {pagination.hasMore ? (
            <Link
              href={pageUrl(page + 1)}
              className="rounded-lg border
                border-[#e9dfbd] bg-white px-4 py-2
                text-sm hover:bg-[#fff9e9]"
            >
              {isArabic ? "التالي" : "Next →"}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
