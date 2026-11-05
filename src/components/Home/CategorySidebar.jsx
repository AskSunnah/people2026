// src/components/Home/CategorySidebar.jsx
// Left rail (lg+). On category pages pass `activePath` to highlight the
// current topic and expand its subcategories as a tree.
import Link from "next/link";

const sortByOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
const isOn = (active, path) =>
  active === path || active?.startsWith(`${path}/`);

function Branch({ items, locale, activePath, depth = 0 }) {
  return (
    <ul
      className={
        depth
          ? "ms-3 mt-0.5 space-y-0.5 border-s border-[#eadfb5] ps-2"
          : "space-y-0.5"
      }
    >
      {[...items].sort(sortByOrder).map((cat) => {
        const inBranch = activePath && isOn(activePath, cat.path);
        const exact = activePath === cat.path;
        return (
          <li key={cat._id}>
            <Link
              href={`/${locale}/categories/${cat.path}`}
              aria-current={exact ? "page" : undefined}
              className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors
                focus-visible:outline-2 focus-visible:outline-[#c8aa35]
                ${
                  exact
                    ? "bg-[#fff1bf] font-semibold text-[#6f5700]"
                    : "text-[var(--text-main)] hover:bg-[#fff6d8] hover:text-[#8a6d00]"
                }`}
            >
              <span className="truncate">{cat.name}</span>
              <span className="shrink-0 rounded-full bg-[#fbf3d3] px-2 py-0.5 text-xs text-[#8a6d00] tabular-nums">
                {cat.questionCount || 0}
              </span>
            </Link>
            {inBranch && cat.children?.length > 0 && (
              <Branch
                items={cat.children}
                locale={locale}
                activePath={activePath}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function CategorySidebar({
  categories = [],
  locale,
  limit = 9,
  activePath,
}) {
  const isArabic = locale === "ar";
  const sorted = [...categories].sort(sortByOrder);
  // Never cut off the branch the visitor is currently in
  const visible = sorted.filter(
    (c, i) => i < limit || (activePath && isOn(activePath, c.path)),
  );

  if (visible.length === 0) return null;

  return (
    <nav
      aria-labelledby="home-categories-heading"
      className="rounded-xl border border-[#e9dfbd] bg-white p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
    >
      <h2
        id="home-categories-heading"
        className="px-2 pb-2 pt-1 text-base font-bold text-[var(--bg-color-header)]"
      >
        {isArabic ? "تصفح حسب الموضوع" : "Browse by topic"}
      </h2>

      <Branch items={visible} locale={locale} activePath={activePath} />

      <Link
        href={`/${locale}/categories`}
        className="mt-2 flex items-center justify-between rounded-lg border-t border-[#f0e6c9] px-2.5 pb-2 pt-3 text-sm font-semibold text-[#a88700] hover:text-[#7a6100]"
      >
        {isArabic ? "كل التصنيفات" : "All categories"}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="rtl:rotate-180"
          aria-hidden="true"
        >
          <path d="M6 3l5 5-5 5" />
        </svg>
      </Link>
    </nav>
  );
}
