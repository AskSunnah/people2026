"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import Sidebar from "@/components/Library/Sidebar";
import BookContent from "@/components/Library/BookContent";
import Controls from "@/components/Library/Controls";

import { ReportModal } from "@/components/common/ReportableContent";

import { Flag, Share2 } from "lucide-react";

const getReadingProgressKey = (lang, slug) =>
  `reading-progress:${lang}:${slug}`;

const getReadingHistoryKey = () => "reading-history";

function saveReadingProgress({ lang, slug, pageIndex, book }) {
  if (!book) return;

  const progress = {
    lang,
    slug,
    title: book.title || "",
    author: book.author || "",
    pageIndex,
    pageNumber: pageIndex + 1,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    getReadingProgressKey(lang, slug),
    JSON.stringify(progress),
  );

  let oldHistory = [];

  try {
    oldHistory = JSON.parse(
      localStorage.getItem(getReadingHistoryKey()) || "[]",
    );
  } catch {
    oldHistory = [];
  }

  const filteredHistory = oldHistory.filter(
    (item) => !(item.lang === lang && item.slug === slug),
  );

  const newHistory = [progress, ...filteredHistory].slice(0, 30);

  localStorage.setItem(getReadingHistoryKey(), JSON.stringify(newHistory));
}

function getSavedPageIndex(lang, slug) {
  const saved = localStorage.getItem(getReadingProgressKey(lang, slug));

  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved);

    if (typeof parsed.pageIndex === "number") {
      return parsed.pageIndex;
    }

    if (typeof parsed.pageNumber === "number") {
      return parsed.pageNumber - 1;
    }

    return null;
  } catch {
    return null;
  }
}

export default function BookReaderClient({ book, lang, slug }) {
  const t = useTranslations("library");

  const searchParams = useSearchParams();

  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(0);

  const [fontSize, setFontSize] = useState(1.1);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isTashkeelRemoved, setIsTashkeelRemoved] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);

  const audioRef = useRef(null);

  const touchStartX = useRef(null);

  const touchStartY = useRef(null);

  const initializedRef = useRef(false);

  const dir = lang === "ar" ? "rtl" : "ltr";

  const isArabic = lang === "ar";

  const totalPages = book?.pages?.length || 0;

  // ─────────────────────────────────────────────
  // Navigation helper
  // ─────────────────────────────────────────────

  const goToPage = useCallback(
    (valueOrUpdater) => {
      if (totalPages === 0) {
        return;
      }

      const nextPage =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(currentPage)
          : valueOrUpdater;

      const safePage = Math.min(Math.max(nextPage, 0), totalPages - 1);

      // Update React state first.
      setCurrentPage(safePage);

      // Update the URL OUTSIDE the state updater.
      router.replace(`/library/read/${slug}?page=${safePage + 1}`, {
        scroll: false,
      });

      saveReadingProgress({
        lang,
        slug,
        pageIndex: safePage,
        book,
      });

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsPlaying(false);
      }
    },
    [currentPage, totalPages, router, slug, lang, book],
  );

  // ─────────────────────────────────────────────
  // Initial page
  // URL page has priority over localStorage
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    let startingPageIndex = 0;

    const pageParam = searchParams.get("page");

    if (pageParam) {
      startingPageIndex = Number(pageParam) - 1;
    } else {
      const savedPageIndex = getSavedPageIndex(lang, slug);

      if (typeof savedPageIndex === "number") {
        startingPageIndex = savedPageIndex;
      }
    }

    const safePage =
      totalPages > 0
        ? Math.min(
            Math.max(
              Number.isFinite(startingPageIndex) ? startingPageIndex : 0,
              0,
            ),
            totalPages - 1,
          )
        : 0;

    setCurrentPage(safePage);

    router.replace(`/library/read/${slug}?page=${safePage + 1}`, {
      scroll: false,
    });

    saveReadingProgress({
      lang,
      slug,
      pageIndex: safePage,
      book,
    });
  }, [book, lang, slug, searchParams, totalPages, router]);

  // ─────────────────────────────────────────────
  // Browser URL back/forward → reader page
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!totalPages) {
      return;
    }

    const pageFromUrl = Number(searchParams.get("page")) || 1;

    const safePage = Math.min(Math.max(pageFromUrl - 1, 0), totalPages - 1);

    setCurrentPage((previous) => {
      if (previous === safePage) {
        return previous;
      }

      return safePage;
    });

    saveReadingProgress({
      lang,
      slug,
      pageIndex: safePage,
      book,
    });
  }, [searchParams, totalPages, book, lang, slug]);

  // ─────────────────────────────────────────────
  // Keyboard navigation
  // ─────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (document.activeElement?.tagName === "INPUT") {
        return;
      }

      if (!totalPages) {
        return;
      }

      const forwardKey = isArabic ? "ArrowLeft" : "ArrowRight";

      const backwardKey = isArabic ? "ArrowRight" : "ArrowLeft";

      if (event.key === forwardKey) {
        if (currentPage < totalPages - 1) {
          goToPage((page) => page + 1);
        }
      } else if (event.key === backwardKey) {
        if (currentPage > 0) {
          goToPage((page) => page - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, goToPage, isArabic]);

  // ─────────────────────────────────────────────
  // Swipe navigation
  // ─────────────────────────────────────────────

  useEffect(() => {
    const handleTouchStart = (event) => {
      touchStartX.current = event.touches[0].clientX;

      touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = (event) => {
      if (touchStartX.current === null) {
        return;
      }

      const dx = event.changedTouches[0].clientX - touchStartX.current;

      const dy = event.changedTouches[0].clientY - touchStartY.current;

      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) {
        touchStartX.current = null;

        touchStartY.current = null;

        return;
      }

      const swipedForward = isArabic ? dx > 0 : dx < 0;

      const swipedBackward = isArabic ? dx < 0 : dx > 0;

      if (swipedForward && currentPage < totalPages - 1) {
        goToPage((page) => page + 1);
      } else if (swipedBackward && currentPage > 0) {
        goToPage((page) => page - 1);
      }

      touchStartX.current = null;

      touchStartY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    window.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);

      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPage, totalPages, goToPage, isArabic]);

  // ─────────────────────────────────────────────
  // Audio
  // ─────────────────────────────────────────────

  function handleAudioToggle(audioUrl) {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();

      audioRef.current = null;

      setIsPlaying(false);

      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);

    audioRef.current = audio;

    audio.play();

    setIsPlaying(true);

    audio.addEventListener(
      "ended",
      () => {
        setIsPlaying(false);
      },
      {
        once: true,
      },
    );
  }

  // ─────────────────────────────────────────────
  // Share
  // ─────────────────────────────────────────────

  const handleShare = async () => {
    const title = document.title;

    const url = window.location.href;

    const text = isArabic
      ? `📖 اقرأ هذا الكتاب على موقع السنّة: ${title}`
      : `📖 Read this book on AskSunnah: ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.log("Sharing cancelled or failed:", error);
      }

      return;
    }

    await navigator.clipboard.writeText(url);

    alert(
      isArabic
        ? `📋 ${t("reader.copySuccess")}`
        : `📋 ${t("reader.copySuccess")}`,
    );
  };

  // ─────────────────────────────────────────────
  // Current page
  // ─────────────────────────────────────────────

  const page = book.pages?.[currentPage] || {
    blocks: [],
    references: [],
  };

  // ─────────────────────────────────────────────
  // Exact original Reader UI
  // ─────────────────────────────────────────────

  return (
    <div dir={dir} className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header
        className="text-white py-6 px-8 text-center shrink-0"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/books.jpeg")',
          backgroundSize: "auto",
          backgroundPosition: "center",
        }}
      >
        <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl leading-tight break-words text-center truncate text-wrap">
          {book.title}
        </h1>
      </header>
      <nav className="bg-[var(--bg-main)] px-6 py-3 z-10 shrink-0 border-b border-[var(--border-color)] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
        <ul className="list-none m-0 p-0 flex flex-wrap justify-center gap-6">
          <li>
            <Link className="nav-link" href="/">
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </li>

          <li>
            <Link className="nav-link" href="/library">
              {lang === "ar" ? "المكتبة" : "Library"}
            </Link>
          </li>

          <li>
            <Link className="nav-link" href={`/books/${slug}`}>
              {t("reader.bookDetails")}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Body */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
            shrink-0 bg-[var(--bg-main)] border-e border-[var(--border-color)] overflow-y-auto
            w-[22%] min-w-[180px]
            max-md:fixed max-md:inset-y-0 max-md:start-0 max-md:w-[75vw] max-md:max-w-[300px]
            max-md:z-50 max-md:shadow-xl max-md:transition-transform max-md:duration-300
            ${sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
            ${isArabic && !sidebarOpen ? "max-md:translate-x-full" : ""}
            ${isArabic && sidebarOpen ? "max-md:translate-x-0" : ""}
          `}
        >
          <div className="p-4 max-md:pt-16">
            <Sidebar
              open={sidebarOpen}
              chapters={book.chapters}
              setCurrentPage={(pageIndex) => {
                goToPage(pageIndex);

                setSidebarOpen(false);
              }}
              currentPage={currentPage}
              pages={book.pages}
              tocLabel={t("reader.tableOfContents")}
              isRTL={isArabic}
            />
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 max-md:block hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto pb-16">
          {/* Mobile contents button */}
          <button
            type="button"
            className="md:hidden flex items-center gap-2 text-[0.85rem] text-[var(--primary)] bg-transparent border-none cursor-pointer px-4 py-2 shrink-0"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={t("reader.contents")}
            aria-expanded={sidebarOpen}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />

              <line x1="3" y1="12" x2="15" y2="12" />

              <line x1="3" y1="18" x2="18" y2="18" />
            </svg>

            {sidebarOpen ? t("reader.hideContents") : t("reader.contents")}
          </button>

          {/* Original action bar */}
          <div className="flex items-center gap-2 px-3 pt-2 pb-1 flex-wrap">
            {isArabic && (
              <>
                <button
                  type="button"
                  className="bg-[#0c0c0c] text-white border-none px-4 py-1.5 rounded-full cursor-pointer text-[0.85rem] hover:bg-[#ef0000f6] transition-colors"
                  onClick={() => setIsTashkeelRemoved((previous) => !previous)}
                >
                  {isTashkeelRemoved ? "استعادة التشكيل" : "إزالة التشكيل"}
                </button>

                {page.audioUrl && (
                  <button
                    type="button"
                    onClick={() => handleAudioToggle(page.audioUrl)}
                    title="تشغيل الصوت"
                    aria-label={isPlaying ? "إيقاف الصوت" : "تشغيل الصوت"}
                    className="bg-white border border-[#ccc] text-[#333] rounded-[8px] cursor-pointer px-2.5 py-1.5 flex items-center justify-center h-8 transition-all duration-200 hover:text-[#0077cc] hover:border-[#0077cc] hover:scale-105"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      width="18"
                      height="18"
                      style={{
                        transform: "scaleX(-1)",
                      }}
                    >
                      {isPlaying ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 9h2v6h-2zM14 9h2v6h-2z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 5.25 6.75 9H4.5v6h2.25l4.5 3.75V5.25z M16.5 8.25a3.75 3.75 0 010 7.5 m2.25-10.5a7.5 7.5 0 010 13.5"
                        />
                      )}
                    </svg>
                  </button>
                )}
              </>
            )}

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              title={t("reader.share")}
              aria-label={t("reader.share")}
              className="bg-white border border-[#ccc] text-[#333] rounded-[8px] cursor-pointer px-2.5 py-1.5 flex items-center justify-center h-8 transition-all duration-200 hover:text-[#0077cc] hover:border-[#0077cc] hover:scale-105"
            >
              <Share2 size={16} />
            </button>

            {/* Report */}
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              title={t("reader.reportIssue")}
              aria-label={t("reader.reportIssue")}
              className="bg-white border border-[#ccc] text-[#333] rounded-[8px] cursor-pointer px-2.5 py-1.5 flex items-center justify-center h-8 transition-all duration-200 hover:text-[#c3a421] hover:border-[#c3a421] hover:scale-105"
            >
              <Flag size={15} />
            </button>
          </div>

          {/* Existing BookContent */}
          <div className="px-3 pb-2">
            <BookContent
              key={`${slug}-${currentPage}`}
              blocks={page.blocks || []}
              references={page.references || []}
              fontSize={fontSize}
              removeTashkeel={isTashkeelRemoved}
              lang={lang}
            />
          </div>
        </main>
      </div>

      {/* Existing Controls */}
      <Controls
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={goToPage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        isRTL={isArabic}
      />

      {/* Existing report modal */}
      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        lang={lang}
        contentType="book_page"
        slug={slug}
        bookId={book._id}
        chapterNumber={book.chapters?.[page.chapterIndex]?.number}
        pageNumber={page.number}
      />
    </div>
  );
}
