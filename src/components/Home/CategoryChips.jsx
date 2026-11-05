// src/components/Home/CategoryChips.jsx
// Mobile / tablet (below xl). Horizontal scroll strip of real links.
import Link from "next/link";

const sortByOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

export default function CategoryChips({ categories = [], locale }) {
  const isArabic = locale === "ar";
  const top = [...categories].sort(sortByOrder);

  if (top.length === 0) return null;

  return (
    <section aria-labelledby="home-chips-heading" className="lg:hidden">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id="home-chips-heading" className="text-lg font-bold">
          {isArabic ? "تصفح حسب الموضوع" : "Browse by topic"}
        </h2>
        <Link
          href={`/${locale}/categories`}
          className="text-sm font-semibold text-[#a88700] hover:underline"
        >
          {isArabic ? "عرض الكل" : "View all"}
        </Link>
      </div>

      {/* negative margin lets the strip bleed to the screen edge */}
      <ul className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {top.map((cat) => (
          <li key={cat._id} className="snap-start">
            <Link
              href={`/${locale}/categories/${cat.path}`}
              className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[#e9dfbd]
                bg-white px-4 py-2 text-sm font-medium transition-colors
                hover:border-[#c8aa35] hover:bg-[#fff6d8]
                focus-visible:outline-2 focus-visible:outline-[#c8aa35]"
            >
              {cat.name}
              <span className="text-xs text-[#8a6d00] tabular-nums">
                {cat.questionCount || 0}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
