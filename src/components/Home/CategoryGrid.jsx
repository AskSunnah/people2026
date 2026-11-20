// src/components/Home/CategoryGrid.jsx
// Desktop (lg+) topic grid shown under the hero. Replaces the left rail on the
// home page, so there is no tall empty column beside the content.
// Below lg, CategoryChips takes over.
import Link from "next/link";

const sortByOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

export default function CategoryGrid({ categories = [], locale, limit = 10 }) {
  const isArabic = locale === "ar";
  const top = [...categories].sort(sortByOrder).slice(0, limit);

  if (top.length === 0) return null;

  const countLabel = (n) =>
    isArabic ? `${n} سؤال` : `${n} ${n === 1 ? "question" : "questions"}`;

  return (
    <section aria-labelledby="home-topics-heading" className="hidden lg:block">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id="home-topics-heading" className="m-0 text-lg font-bold">
          {isArabic ? "تصفح حسب الموضوع" : "Browse by topic"}
        </h2>
        <Link
          href={`/${locale}/categories`}
          className="text-sm font-semibold text-[#a88700] hover:underline"
        >
          {isArabic ? "عرض الكل" : "View all"}
        </Link>
      </div>

      <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0 xl:grid-cols-5">
        {top.map((cat) => (
          <li key={cat._id}>
            <Link
              href={`/${locale}/categories/${cat.path}`}
              className="flex h-full flex-col justify-between gap-1.5 rounded-xl border border-[#e9dfbd]
                bg-white px-4 py-3 no-underline transition-colors
                hover:border-[#c8aa35] hover:bg-[#fffaf0]
                focus-visible:outline-2 focus-visible:outline-[#c8aa35]"
            >
              <span className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--text-main)]">
                {cat.name}
              </span>
              <span className="text-xs tabular-nums text-[#8a6d00]">
                {countLabel(cat.questionCount || 0)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
