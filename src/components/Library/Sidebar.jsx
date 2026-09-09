"use client";

import ChapterList from "./ChapterList";

export default function Sidebar({
  chapters = [],
  setCurrentPage,
  currentPage,
  pages = [],
  tocLabel = "Table of Contents",
  isRTL = false,
}) {
  return (
    <aside dir={isRTL ? "rtl" : "ltr"} className="w-full">
      <h2 className="text-[1rem] sm:text-[1.05rem] font-semibold text-[var(--text-main)] mb-5">
        {tocLabel}
      </h2>

      <ChapterList
        chapters={chapters}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        pages={pages}
        isRTL={isRTL}
      />
    </aside>
  );
}
