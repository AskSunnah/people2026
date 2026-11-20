"use client";

// Buttons, not <a href="#">. Removed the injected <style> block too:
// its `div::-webkit-scrollbar` rule hid scrollbars on every div on the page.
function pageList(current, total) {
  const set = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...set]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

const Chevron = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 3l5 5-5 5" />
  </svg>
);

const base =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium tabular-nums transition-colors";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const go = (page) => {
    onPageChange(page);
    document
      .getElementById("fatwaList")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5 border-t border-[#eee4c4] pt-6"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => go(currentPage - 1)}
        className={`${base} text-[#8a6d00] hover:bg-[#fff6d8] disabled:pointer-events-none disabled:opacity-30 rotate-180 rtl:rotate-0`}
      >
        <Chevron />
      </button>

      {pageList(currentPage, totalPages).map((p, i) =>
        p === "gap" ? (
          <span
            key={`gap-${i}`}
            className="px-1 text-gray-400"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`${base} ${
              p === currentPage
                ? "pointer-events-none bg-[#c8aa35] font-semibold text-white"
                : "text-[#8a6d00] hover:bg-[#fff6d8]"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => go(currentPage + 1)}
        className={`${base} text-[#8a6d00] hover:bg-[#fff6d8] disabled:pointer-events-none disabled:opacity-30 rtl:rotate-180`}
      >
        <Chevron />
      </button>
    </nav>
  );
};

export default Pagination;
