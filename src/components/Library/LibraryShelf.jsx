import { Link } from "@/i18n/navigation";

export default function LibraryShelf({
  title,
  books,
  total,
  browseLabel,
  lang,
  compact = false,
  actions = null,
}) {
  if (!books?.length) return null;
  const isAr = lang === "ar";

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      lang={lang}
      className="flex flex-col overflow-hidden rounded-2xl border border-[#eadfb5] bg-[#fffdf5] shadow-xl"
    >
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b-2 border-[#c9a227] px-5 py-3">
        <h2
          className={`font-bold tracking-wide text-[#3b2f0b] ${
            compact ? "text-base" : "text-xl"
          }`}
        >
          {title}
        </h2>

        <div className="flex items-center gap-3">
          {total && <span className="text-sm text-[#8a5a00]">{total}</span>}
          {actions}
        </div>
      </header>

      <ol>
        {books.map((book, i) => {
          const id = book.slug || book._id || book.id;
          const author =
            typeof book.author === "object" ? book.author?.name : book.author;
          const category =
            typeof book.category === "object"
              ? book.category?.name
              : book.category;

          return (
            <li key={id} className="border-b border-[#eadfb5] last:border-b-0">
              <Link
                href={`/books/${id}`}
                locale={lang}
                className={`group flex items-start gap-4 px-5 transition hover:bg-[#fdf6d8] ${
                  compact ? "py-3" : "py-4"
                }`}
              >
                {!compact && (
                  <span className="w-5 shrink-0 pt-0.5 text-sm tabular-nums text-[#b89b3c]">
                    {i + 1}
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  <span
                    className={`line-clamp-2 block font-semibold leading-snug text-[#2b2410] group-hover:text-[#8a5a00] ${
                      compact ? "text-[15px]" : "text-[17px]"
                    }`}
                  >
                    {book.title}
                  </span>
                  {author && (
                    <span className="mt-0.5 line-clamp-1 block text-sm text-[#6b6035]">
                      {author}
                    </span>
                  )}
                </span>

                {!compact && category && (
                  <span className="hidden shrink-0 pt-1 text-[11px] font-semibold uppercase tracking-wider text-[#8a5a00] sm:block">
                    {category}
                  </span>
                )}

                <span
                  aria-hidden
                  className="shrink-0 pt-0.5 text-[#c9a227] transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <Link
        href="/books"
        locale={lang}
        className="border-t border-[#eadfb5] px-5 py-3.5 text-center text-sm font-semibold text-[#8a5a00] transition hover:bg-[#c9a227] hover:text-white"
      >
        {browseLabel} {isAr ? "←" : "→"}
      </Link>
    </section>
  );
}
