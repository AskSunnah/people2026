"use client";

import { Link } from "@/i18n/navigation";

export default function BookCard({ book, getCategoryLabel, onDownload, t }) {
  return (
    <div
      data-category={book.category}
      className="bg-white rounded-[10px] flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.10)] border border-[#e9e0c8] overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
    >
      {/* Gold top line */}
      <div
        className="h-[3px] w-full"
        style={{
          background: "var(--button-gradient)",
        }}
      />

      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <span className="self-start text-[0.68rem] font-semibold uppercase tracking-wide bg-[#fef3c7] text-[#92400e] px-2 py-[2px] rounded-full mb-3">
          {getCategoryLabel(book.category)}
        </span>

        {/* Title */}
        <div className="text-[1rem] font-bold mb-1 leading-snug text-[var(--text-main)]">
          {book.title}
        </div>

        {/* Author */}
        <div className="text-[0.82rem] text-[var(--text-secondary)] mb-4 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A4 4 0 018 17h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          {book.author || t("books.unknownAuthor")}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/library/read/${book.slug}`}
            className="flex items-center gap-1.5 flex-1 justify-center bg-[#c9a227] text-[#3a2000] py-[0.48rem] px-3 rounded-[6px] no-underline font-bold text-[0.82rem] transition-opacity hover:opacity-80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>

            {t("books.read")}
          </Link>

          <button
            type="button"
            onClick={() => onDownload(book._id)}
            className="flex items-center gap-1.5 flex-1 justify-center bg-[#1f6f3e] text-white border-none py-[0.48rem] px-3 rounded-[6px] cursor-pointer font-normal text-[0.82rem] transition-opacity hover:opacity-80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>

            {t("books.download")}
          </button>
        </div>
      </div>
    </div>
  );
}
