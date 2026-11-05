import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getCategories } from "@/services/category.service";
import { buildMetadata } from "@/lib/seo";

// SEO metadata for the Categories directory
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

// Show child categories recursively
function SubcategoryItem({ category, locale }) {
  const isArabic = locale === "ar";

  return (
    <li>
      <Link
        href={`/${locale}/categories/${category.path}`}
        className="flex items-center justify-between gap-2
          rounded-md px-2 py-1.5 text-sm
          transition-colors hover:bg-[#fff8df]"
      >
        <span className="flex items-center gap-2">
          <span className="text-[#c5a324]">↳</span>
          <span className="text-[var(--text-main)]">{category.name}</span>
        </span>

        <span className="text-xs text-gray-500">
          {category.questionCount || 0}
        </span>
      </Link>

      {category.children?.length > 0 && (
        <ul className="ms-3 border-s border-[#e8ddb4] ps-2">
          {category.children.map((child) => (
            <SubcategoryItem key={child._id} category={child} locale={locale} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default async function CategoriesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isArabic = locale === "ar";

  const categories = await getCategories(locale, true);

  // Use the ordering configured in your admin panel.
  const sortedCategories = [...categories].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

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
      <h1 className="mb-3 text-2xl font-bold text-[var(--bg-color-header)]">
        {isArabic
          ? "تصنيفات الأسئلة والأجوبة الإسلامية"
          : "Islamic Questions & Answers by Category"}
      </h1>

      <p className="mb-8 text-sm leading-7">
        {isArabic
          ? "استكشف الأسئلة والأجوبة الإسلامية المصنفة حسب الموضوع والمبنية على القرآن والسنة."
          : "Explore Islamic questions and answers organized by topic, based on the Qur'an and Sunnah."}
      </p>

      {sortedCategories.length === 0 ? (
        <p className="text-sm text-gray-500">
          {isArabic ? "لا توجد تصنيفات متاحة." : "No categories available yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sortedCategories.map((category) => (
            <section
              key={category._id}
              className="
                overflow-hidden rounded-xl
                border border-[#e9dfbd] bg-white
                transition-colors hover:border-[#c8aa35]
              "
            >
              {/* Clickable main category area */}
              <Link
                href={`/${locale}/categories/${category.path}`}
                className="
                  group block p-4
                  hover:bg-[#fffaf0]
                  focus-visible:outline-2
                  focus-visible:outline-[#c8aa35]
                "
              >
                <div className="flex items-center justify-between gap-2">
                  <h2
                    className="text-lg font-semibold
                      text-[var(--bg-color-header)]"
                  >
                    {category.name}
                  </h2>

                  <span
                    className="text-lg text-[#c8aa35]
                      transition-transform
                      group-hover:translate-x-1
                      rtl:group-hover:-translate-x-1"
                  >
                    {isArabic ? "←" : "→"}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {category.questionCount || 0}{" "}
                  {isArabic
                    ? "سؤال"
                    : category.questionCount === 1
                      ? "question"
                      : "questions"}
                </p>
              </Link>

              {/* Optional description */}
              {category.description && (
                <p className="px-4 pb-3 text-sm leading-6 text-gray-600">
                  {category.description}
                </p>
              )}

              {/* Separate clickable subcategories */}
              {category.children?.length > 0 && (
                <div className="border-t border-[#f0e6c9] px-3 py-2">
                  <ul className="space-y-1">
                    {category.children.map((child) => (
                      <SubcategoryItem
                        key={child._id}
                        category={child}
                        locale={locale}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
