// src/components/Home/LibraryCard.jsx
import Link from "next/link";

export default function LibraryCard({ locale, bookCount, className = "" }) {
  const isArabic = locale === "ar";

  return (
    <section
      aria-labelledby="home-library-heading"
      className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-[#c9a82a] to-[#a98a14]
        p-5 text-white shadow-[0_2px_10px_rgba(120,90,0,0.25)] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute bottom-0 end-4 flex items-end gap-1 opacity-30"
      >
        <span className="h-14 w-3 rounded-t-sm bg-white" />
        <span className="h-20 w-3 rounded-t-sm bg-white" />
        <span className="h-16 w-3 rounded-t-sm bg-white" />
        <span className="h-24 w-3 rounded-t-sm bg-white" />
      </div>

      <h2
        id="home-library-heading"
        className="mb-1 text-lg font-bold !text-white"
      >
        {isArabic ? "استكشف المكتبة" : "Explore the Library"}
      </h2>

      <p className="relative max-w-[16rem] text-sm leading-6 text-white/90">
        {isArabic
          ? "تصفح كتبًا إسلامية بالعربية والإنجليزية، مجانًا للقراءة عبر الإنترنت."
          : "Browse Islamic books in Arabic and English, free to read online."}
      </p>

      {bookCount > 0 && (
        <p className="relative mt-2 text-sm font-semibold tabular-nums">
          {bookCount} {isArabic ? "كتاب" : bookCount === 1 ? "book" : "books"}
        </p>
      )}

      <Link
        href={`/${locale}/library`}
        className="relative mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold
          text-[#7a6100] transition-colors hover:bg-[#fff6d8]
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {isArabic ? "تصفح المكتبة" : "Browse the library"}
      </Link>
    </section>
  );
}
