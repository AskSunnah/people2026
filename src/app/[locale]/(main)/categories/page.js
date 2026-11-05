// src/app/[locale]/(main)/categories/page.js
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getCategories } from "@/services/category.service";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import LibraryCard from "@/components/Home/LibraryCard";
import ContributeCard from "@/components/Home/ContributeCard";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/categories",
    title:
      locale === "ar"
        ? "تصنيفات الأسئلة والأجوبة الإسلامية"
        : "Islamic Questions & Answers by Category",
    description:
      locale === "ar"
        ? "تصفح الأسئلة والأجوبة الإسلامية حسب الموضوع، بناءً على القرآن والسنة."
        : "Browse Islamic questions and answers by category, based on the Qur'an and Sunnah.",
  });
}

const MAX_CHILDREN = 5;

export default async function CategoriesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isArabic = locale === "ar";

  const categories = await getCategories(locale, true);
  const sorted = [...categories].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const totalQuestions = sorted.reduce((n, c) => n + (c.questionCount || 0), 0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isArabic
      ? "تصنيفات الأسئلة والأجوبة"
      : "Questions & Answers by Category",
    url: `${SITE_URL}/${locale}/categories`,
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sorted.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/${locale}/categories/${c.path}`,
        name: c.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <div
        className="mx-auto my-8 max-w-[1100px] rounded-[10px] bg-[var(--bg-main)]
          px-6 py-8 text-[var(--text-main)] shadow-[2px_3px_12px_rgba(0,0,0,0.14)]
          max-md:mx-4 max-md:px-4"
      >
        <header className="mb-8 max-w-2xl">
          <h1 className="mb-3 text-2xl font-bold text-[var(--bg-color-header)]">
            {isArabic
              ? "تصنيفات الأسئلة والأجوبة الإسلامية"
              : "Islamic Questions & Answers by Category"}
          </h1>
          <p className="text-sm leading-7">
            {isArabic
              ? "استكشف الأسئلة والأجوبة المصنفة حسب الموضوع، والمبنية على القرآن والسنة."
              : "Explore questions and answers organized by topic, based on the Qur'an and Sunnah."}
          </p>
          <p className="mt-2 text-sm text-gray-500 tabular-nums">
            {sorted.length} {isArabic ? "تصنيف" : "categories"} ·{" "}
            {totalQuestions} {isArabic ? "سؤال" : "questions"}
          </p>
        </header>

        {sorted.length === 0 ? (
          <p className="text-sm text-gray-500">
            {isArabic
              ? "لا توجد تصنيفات متاحة."
              : "No categories available yet."}
          </p>
        ) : (
          // CSS columns = masonry: cards keep their natural height, no empty half-cards
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {sorted.map((cat) => {
              const kids = cat.children || [];
              const shown = kids.slice(0, MAX_CHILDREN);
              const extra = kids.length - shown.length;

              return (
                <section
                  key={cat._id}
                  className="mb-4 break-inside-avoid overflow-hidden rounded-xl
                    border border-[#e9dfbd] bg-white transition-colors hover:border-[#c8aa35]"
                >
                  <Link
                    href={`/${locale}/categories/${cat.path}`}
                    className="block p-4 hover:bg-[#fffaf0]
                      focus-visible:outline-2 focus-visible:outline-[#c8aa35]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold leading-snug text-[var(--bg-color-header)]">
                        {cat.name}
                      </h2>
                      <span className="shrink-0 rounded-full bg-[#fbf3d3] px-2.5 py-0.5 text-xs font-medium text-[#8a6d00] tabular-nums">
                        {cat.questionCount || 0}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                        {cat.description}
                      </p>
                    )}
                  </Link>

                  {shown.length > 0 && (
                    <ul className="border-t border-[#f0e6c9] px-2 py-2">
                      {shown.map((child) => (
                        <li key={child._id}>
                          <Link
                            href={`/${locale}/categories/${child.path}`}
                            className="flex items-center justify-between gap-2 rounded-md
                              px-2 py-1.5 text-sm hover:bg-[#fff6d8]"
                          >
                            <span>{child.name}</span>
                            <span className="text-xs text-gray-500 tabular-nums">
                              {child.questionCount || 0}
                            </span>
                          </Link>
                        </li>
                      ))}
                      {extra > 0 && (
                        <li>
                          <Link
                            href={`/${locale}/categories/${cat.path}`}
                            className="block rounded-md px-2 py-1.5 text-xs font-semibold text-[#a88700] hover:underline"
                          >
                            {isArabic ? `و${extra} أخرى` : `+${extra} more`}
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {/* Don't let the page end on a dead stop */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <LibraryCard locale={locale} />
          <ContributeCard locale={locale} />
        </div>
      </div>
    </>
  );
}
