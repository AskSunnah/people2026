import Link from "next/link";

export default function CategorySection({ categories = [], locale = "en" }) {
  const isArabic = locale === "ar";

  // Show top 6 categories based on question count
  const featured = categories
    .filter((category) => category.questionCount > 0)
    .sort((a, b) => b.questionCount - a.questionCount || a.order - b.order)
    .slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="my-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-[var(--bg-color-header)]">
          {isArabic ? "تصفح حسب التصنيف" : "Explore by Category"}
        </h2>

        <Link
          href={`/${locale}/categories`}
          className="text-sm font-medium text-[var(--bg-color-header)] hover:underline"
        >
          {isArabic ? "عرض جميع التصنيفات" : "View all categories →"}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {featured.map((category) => (
          <Link
            key={category._id}
            href={`/${locale}/categories/${category.path}`}
            className="
              flex flex-col gap-1 rounded-lg
              border border-[#e9dfbd]
              bg-white p-4
              transition-all
              hover:border-[#c8aa35]
              hover:bg-[#fff9e9]
              hover:shadow-sm
            "
          >
            <span className="text-sm font-semibold text-[var(--text-main)]">
              {category.name}
            </span>

            <span className="text-xs text-gray-500">
              {category.questionCount} {isArabic ? "سؤال" : "questions"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
