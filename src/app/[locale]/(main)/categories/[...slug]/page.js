// src/app/[locale]/(main)/categories/[...slug]/page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import {
  getCategories,
  getCategoryQuestions,
} from "@/services/category.service";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import CategorySidebar from "@/components/Home/CategorySidebar";
import CategoryChips from "@/components/Home/CategoryChips";
import LibraryCard from "@/components/Home/LibraryCard";
import AskCard from "@/components/Home/AskCard";
import RightRail from "@/components/Home/Rightrail";

function getPageNumber(searchParams = {}) {
  const raw = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const number = Number(raw || 1);
  return Number.isSafeInteger(number) && number > 0 ? number : 1;
}

function findCategory(tree, path) {
  for (const category of tree) {
    if (category.path === path) return category;
    const child = findCategory(category.children || [], path);
    if (child) return child;
  }
  return null;
}

function getBreadcrumbs(tree, path) {
  const segments = path.split("/");
  const out = [];
  for (let i = 0; i < segments.length; i++) {
    const current = segments.slice(0, i + 1).join("/");
    const category = findCategory(tree, current);
    if (category) out.push({ name: category.name, path: category.path });
  }
  return out;
}

// 1 … 4 5 [6] 7 8 … 20
function getPageList(page, total) {
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const list = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out = [];
  list.forEach((p, i) => {
    if (i > 0 && p - list[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export async function generateMetadata({ params, searchParams }) {
  const { locale, slug } = await params;
  const query = await searchParams;
  const path = slug.join("/");
  const page = getPageNumber(query);

  const result = await getCategoryQuestions(locale, path, page, 12);
  if (!result?.success) notFound();

  const { category, pagination } = result;
  if (page > 1 && page > pagination.totalPages) notFound();

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

  const baseCanonical = baseMetadata.alternates?.canonical;
  const canonicalUrl = baseCanonical
    ? new URL(String(baseCanonical), SITE_URL)
    : null;
  if (canonicalUrl && page > 1)
    canonicalUrl.searchParams.set("page", String(page));

  return {
    ...baseMetadata,
    alternates: {
      ...baseMetadata.alternates,
      ...(canonicalUrl ? { canonical: canonicalUrl.toString() } : {}),
      languages: undefined,
    },
    ...(pagination.total === 0
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[#c8aa35] transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
      aria-hidden="true"
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
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
  if (page > 1 && page > pagination.totalPages) notFound();

  const breadcrumbs = getBreadcrumbs(categories, path);
  const currentCategory = findCategory(categories, path);
  const children = currentCategory?.children || [];

  const categoryUrl = `/${locale}/categories/${category.path}`;
  const pageUrl = (n) => (n === 1 ? categoryUrl : `${categoryUrl}?page=${n}`);
  const countLabel = isArabic
    ? "سؤال"
    : pagination.total === 1
      ? "question"
      : "questions";

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isArabic ? "التصنيفات" : "Categories",
          item: `${SITE_URL}/${locale}/categories`,
        },
        ...breadcrumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 2,
          name: c.name,
          item: `${SITE_URL}/${locale}/categories/${c.path}`,
        })),
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      url: `${SITE_URL}${categoryUrl}`,
      inLanguage: locale,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: pagination.total,
        itemListElement: questions.map((q, i) => ({
          "@type": "ListItem",
          position: (page - 1) * pagination.limit + i + 1,
          url: `${SITE_URL}/${locale}/questions/${q.slug}`,
          name: q.heading || q.question,
        })),
      },
    },
  ];

  return (
    <>
      {schema.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(s).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <div className="mx-auto my-8 grid max-w-[1280px] items-start gap-6 px-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_260px] max-md:my-0 max-md:px-0">
        {/* Left rail: topic tree with the current topic expanded */}
        <aside className="sticky top-4 hidden lg:block">
          <CategorySidebar
            categories={categories}
            locale={locale}
            activePath={category.path}
            limit={50}
          />
        </aside>

        <main className="min-w-0 rounded-[10px] bg-[var(--bg-main)] px-6 py-8 text-[var(--text-main)] shadow-[2px_3px_12px_rgba(0,0,0,0.14)] max-md:rounded-none max-md:px-4">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500"
          >
            <Link
              href={`/${locale}/categories`}
              className="hover:text-[var(--bg-color-header)]"
            >
              {isArabic ? "التصنيفات" : "Categories"}
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {i === breadcrumbs.length - 1 ? (
                  <span
                    className="font-medium text-[var(--bg-color-header)]"
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

          {/* Header */}
          <header className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[var(--bg-color-header)]">
                {category.name}
              </h1>
              <span className="rounded-full bg-[#fbf3d3] px-3 py-1 text-xs font-medium text-[#8a6d00] tabular-nums">
                {pagination.total} {countLabel}
              </span>
            </div>
            <p className="mt-3 max-w-prose text-sm leading-7">
              {category.description?.trim() ||
                (isArabic
                  ? `تصفح الأسئلة والأجوبة المتعلقة بموضوع ${category.name}.`
                  : `Explore Islamic questions and answers about ${category.name}, based on the Qur'an and Sunnah.`)}
            </p>
          </header>

          {/* Subcategories as chips (compact, not a second grid of cards) */}
          {children.length > 0 && (
            <section
              aria-labelledby="subcats-heading"
              className="mb-7 lg:hidden"
            >
              <h2
                id="subcats-heading"
                className="mb-2 text-sm font-semibold text-gray-600"
              >
                {isArabic ? "التصنيفات الفرعية" : "Subcategories"}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {children.map((child) => (
                  <li key={child._id}>
                    <Link
                      href={`/${locale}/categories/${child.path}`}
                      className="flex items-center gap-2 rounded-full border border-[#e9dfbd] bg-white px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-[#c8aa35] hover:bg-[#fff6d8]"
                    >
                      {child.name}
                      <span className="text-xs text-gray-500 tabular-nums">
                        {child.questionCount || 0}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Questions */}
          <section aria-labelledby="questions-heading">
            <h2
              id="questions-heading"
              className="mb-3 text-lg font-semibold text-[var(--bg-color-header)]"
            >
              {isArabic
                ? "الأسئلة في هذا التصنيف"
                : "Questions in this category"}
            </h2>

            {questions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#e0d2a0] bg-white p-6 text-sm text-gray-600">
                <p>
                  {isArabic
                    ? "لا توجد أسئلة في هذا التصنيف حتى الآن."
                    : "No questions in this category yet."}
                </p>
                <Link
                  href={`/${locale}`}
                  className="mt-3 inline-block font-semibold text-[#a88700] hover:underline"
                >
                  {isArabic ? "اطرح سؤالك" : "Ask a question"}
                </Link>
              </div>
            ) : (
              // Plain list: the numbers weren't a sequence, so they're gone
              <ul className="divide-y divide-[#f0e6c9] overflow-hidden rounded-xl border border-[#e9dfbd] bg-white">
                {questions.map((q) => (
                  <li key={q._id}>
                    <Link
                      href={`/${locale}/questions/${q.slug}`}
                      className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-[#fff9e9] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#c8aa35]"
                    >
                      <span className="flex-1 text-[15px] font-medium leading-6">
                        {q.heading || q.question}
                      </span>
                      <Chevron />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Numbered pagination */}
          {pagination.totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-8 flex flex-wrap items-center justify-center gap-1.5 border-t border-[#e9dfbd] pt-5"
            >
              {page > 1 && (
                <Link
                  href={pageUrl(page - 1)}
                  rel="prev"
                  className="rounded-lg px-3 py-2 text-sm text-[#a88700] hover:bg-[#fff6d8]"
                >
                  {isArabic ? "السابق" : "Previous"}
                </Link>
              )}
              {getPageList(page, pagination.totalPages).map((p, i) =>
                p === "gap" ? (
                  <span
                    key={`gap-${i}`}
                    className="px-1 text-gray-400"
                    aria-hidden="true"
                  >
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={pageUrl(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={`min-w-9 rounded-lg px-3 py-2 text-center text-sm tabular-nums ${
                      p === page
                        ? "bg-[#c8aa35] font-semibold text-white"
                        : "text-[#a88700] hover:bg-[#fff6d8]"
                    }`}
                  >
                    {p}
                  </Link>
                ),
              )}
              {pagination.hasMore && (
                <Link
                  href={pageUrl(page + 1)}
                  rel="next"
                  className="rounded-lg px-3 py-2 text-sm text-[#a88700] hover:bg-[#fff6d8]"
                >
                  {isArabic ? "التالي" : "Next"}
                </Link>
              )}
            </nav>
          )}

          {/* Below xl the right rail is hidden, so show its cards inline */}
          <div className="mt-8 space-y-4 xl:hidden">
            <LibraryCard
              locale={locale}
              topic={category.name}
              hasTopicBooks={result.bookCount > 0}
            />
            <AskCard locale={locale} topic={category.name} />
          </div>

          {/* Below lg the left rail is hidden, so offer other topics here */}
          <div className="mt-8">
            <CategoryChips categories={categories} locale={locale} />
          </div>
        </main>

        {/* Right rail (xl+): books on this topic, ask, contribute */}
        <aside className="sticky top-4 hidden xl:block">
          <RightRail locale={locale} topic={category.name} showAsk />
        </aside>
      </div>
    </>
  );
}
