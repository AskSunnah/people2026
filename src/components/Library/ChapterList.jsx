"use client";

import { Link } from "@/i18n/navigation";

export default function ChapterList({
  chapters = [],
  setCurrentPage,
  currentPage = 0,
  pages = [],
  isRTL = false,
  getLinkHref,
}) {
  if (!chapters?.length) {
    return null;
  }

  let runningPageIndex = 0;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full">
      {chapters.map((chapter, chapterIndex) => {
        const chapterPages = chapter.pages || [];

        const firstPageIndex = runningPageIndex;

        const pageCount = chapterPages.length;

        runningPageIndex += pageCount;

        const lastPageIndex = runningPageIndex - 1;

        const isActive =
          currentPage >= firstPageIndex && currentPage <= lastPageIndex;

        const title =
          chapter.title ||
          chapter.name ||
          `${isRTL ? "الفصل" : "Chapter"} ${chapterIndex + 1}`;

        const pageLabel = isRTL
          ? `${pageCount} ${pageCount === 1 ? "صفحة" : "صفحات"}`
          : `${pageCount} ${pageCount === 1 ? "page" : "pages"}`;

        const content = (
          <>
            <span
              className={`
    block
    text-[0.88rem]
    leading-[1.35]
    transition-colors duration-200

    ${isActive ? "text-[#2b2b2b] font-semibold" : "text-[#a07820] font-normal"}

    hover:text-[#c3a421]
  `}
            >
              {title}
            </span>

            <span className="block mt-[2px] text-[0.66rem] leading-[1.2] text-[var(--text-secondary)]">
              {pageLabel}
            </span>
          </>
        );

        /*
         * Book Details version:
         * links directly into the Reader.
         */
        if (getLinkHref) {
          return (
            <Link
              key={chapter._id || chapter.id || chapterIndex}
              href={getLinkHref(chapter, chapterIndex)}
              className="
                block
                no-underline
                px-2
                py-[7px]
                mb-[3px]
              "
            >
              {content}
            </Link>
          );
        }

        /*
         * Reader sidebar version.
         */
        return (
          <button
            key={chapter._id || chapter.id || chapterIndex}
            type="button"
            onClick={() => {
              if (setCurrentPage) {
                setCurrentPage(firstPageIndex);
              }
            }}
            className={`
              block
              w-full
              bg-transparent
              border-none
              px-2
              py-[7px]
              mb-[3px]
              cursor-pointer

              ${isRTL ? "text-right" : "text-left"}
            `}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
