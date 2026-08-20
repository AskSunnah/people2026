"use client";

import { useEffect, useState } from "react";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 500);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (totalPages <= 1) return null;

  const createBtn = (label, page, isActive = false, key = label) => (
    <a
      key={key}
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onPageChange(page);
        document.getElementById("fatwaList")?.scrollIntoView({ behavior: "smooth" });
      }}
      aria-current={isActive ? "page" : undefined}
      style={{ whiteSpace: "nowrap" }}
      className={`
        inline-block rounded-md no-underline font-medium transition-all duration-200
        mx-[0.15rem] shrink-0 px-3 py-2 text-sm sm:px-3 sm:py-2 sm:text-base
        text-[var(--bg-color-header)]
        hover:bg-[var(--bg-color-header)] hover:text-white
        ${isActive ? "bg-[var(--bg-color-header)] text-white font-bold pointer-events-none" : ""}
      `}
    >
      {label}
    </a>
  );

  const renderButtons = () => {
    const buttons = [];

    const showDots = (key) => (
      <span key={key} className="inline-block px-2 text-[#555] shrink-0 text-sm sm:text-base">
        ...
      </span>
    );

    if (currentPage > 1) buttons.push(createBtn("<", currentPage - 1, false, "prev"));

    buttons.push(createBtn(1, 1, currentPage === 1, "first"));

    if (isSmallScreen) {
      if (currentPage > 2) buttons.push(showDots("dots-left"));
      if (currentPage !== 1 && currentPage !== totalPages) {
        buttons.push(createBtn(currentPage, currentPage, true, "current"));
      }
      if (currentPage < totalPages - 1) buttons.push(showDots("dots-right"));
    } else {
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) buttons.push(showDots("dots-left"));
      for (let i = start; i <= end; i++) {
        buttons.push(createBtn(i, i, currentPage === i, `page-${i}`));
      }
      if (end < totalPages - 1) buttons.push(showDots("dots-right"));
    }

    if (totalPages > 1) {
      buttons.push(createBtn(totalPages, totalPages, currentPage === totalPages, "last"));
    }

    if (currentPage < totalPages) buttons.push(createBtn(">", currentPage + 1, false, "next"));

    return buttons;
  };

  return (
    <div
      className="flex justify-center gap-1 mt-8 flex-nowrap px-2 max-w-full overflow-x-auto overflow-y-hidden sm:overflow-hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>
        {`
          div::-webkit-scrollbar { display: none; }
          @media (max-width: 500px) {
            .pagination-mobile a, .pagination-mobile span {
              font-size: 0.75rem;
              padding: 0.4rem;
            }
          }
        `}
      </style>

      <div className="pagination-mobile flex flex-nowrap">{renderButtons()}</div>
    </div>
  );
};

export default Pagination;
