"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import ChapterList from "@/components/Library/ChapterList";

export default function BookDetailsClient({ book, lang = "en", slug }) {
  const t = useTranslations("library");

  const [activeSection, setActiveSection] = useState("details");

  const dir = lang === "ar" ? "rtl" : "ltr";

  const isRTL = dir === "rtl";

  const totalPages =
    book?.chapters?.reduce(
      (sum, chapter) => sum + (chapter.pages?.length || 0),
      0,
    ) || 0;

  const categoryMap = {
    Aqeedah: t("categories.aqeedah"),
    aqeedah: t("categories.aqeedah"),

    Fiqh: t("categories.fiqh"),
    fiqh: t("categories.fiqh"),

    Hadith: t("categories.hadith"),
    hadith: t("categories.hadith"),

    Seerah: t("categories.seerah"),
    seerah: t("categories.seerah"),
  };

  const languageMap = {
    en: lang === "ar" ? "الإنجليزية" : "English",

    ar: lang === "ar" ? "العربية" : "Arabic",
  };

  const displayLanguage = languageMap[book?.language] || book?.language || "—";

  const displayCategory = categoryMap[book?.category] || book?.category || "—";

  const displayBirthYear = book?.birthYearUnknown
    ? t("details.unknown")
    : book?.birthYear || "—";

  const displayDeathYear =
    book?.deathStatus === "living"
      ? t("details.living")
      : book?.deathStatus === "unknown"
        ? t("details.unknown")
        : book?.deathYear || "—";

  const sections = [
    {
      id: "details",
      title: t("details.bookDetails"),
    },
    {
      id: "author",
      title: t("details.aboutAuthor"),
    },
    {
      id: "book",
      title: t("details.aboutBook"),
    },
  ];

  return (
    <div
      dir={dir}
      className="min-h-screen bg-white text-[#1e293b] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]"
    >
      {/* Original book hero header */}
      <header
        className="text-white px-6 py-10 md:py-14 text-center"
        style={{
          background:
            'linear-gradient(rgba(24,18,5,0.72), rgba(24,18,5,0.72)), url("/books.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-[1.7rem] md:text-[2.4rem] font-bold leading-snug">
            {book.title}
          </h1>
        </div>
      </header>

      {/* Original mini navbar */}
      <nav className="bg-[#fffaf0] border-b border-[#e8d99b] px-6 py-4">
        <ul className="list-none m-0 p-0 flex flex-wrap justify-center gap-8">
          <li>
            <Link
              className="text-[#5c4712] font-semibold no-underline hover:text-[#c3a421] transition-colors"
              href="/"
            >
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </li>

          <li>
            <Link
              className="text-[#5c4712] font-semibold no-underline hover:text-[#c3a421] transition-colors"
              href="/library"
            >
              {lang === "ar" ? "المكتبة" : "Library"}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Original main */}
      <main className="max-w-[1050px] mx-auto my-8 md:my-10 px-4">
        <>
          {/* Original section toggle cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
            {sections.map((section) => {
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`rounded-[20px] border px-5 py-5 text-center font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-[#c3a421] to-[#8a6f17] text-white border-[#c3a421]"
                      : "bg-white text-[#5c4712] border-[#eadca3] hover:border-[#c3a421] hover:bg-[#fffdf7]"
                  }`}
                >
                  <span className="block text-[1rem] md:text-[1.05rem]">
                    {section.title}
                  </span>
                </button>
              );
            })}
          </section>

          {/* Original section content */}
          <section
            className={`bg-white rounded-[24px] border border-[#eadca3] p-6 md:p-8 h-[560px] overflow-y-auto shadow-sm ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {/* DETAILS */}
            <div className={activeSection === "details" ? "block" : "hidden"}>
              <SectionHeading title={t("details.bookDetails")} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <MetaItem label={t("details.book")} value={book.title} />

                <MetaItem
                  label={t("details.author")}
                  value={book.author || "—"}
                />

                <MetaItem
                  label={t("details.birthYear")}
                  value={displayBirthYear}
                />

                <MetaItem
                  label={t("details.deathStatus")}
                  value={displayDeathYear}
                />

                <MetaItem
                  label={t("details.category")}
                  value={displayCategory}
                />

                <MetaItem
                  label={t("details.language")}
                  value={displayLanguage}
                />

                <MetaItem label={t("details.totalPages")} value={totalPages} />
              </div>

              <div>
                <h4 className="text-[1.1rem] md:text-[1.2rem] font-bold text-[#5c4712] mb-4">
                  {t("details.index")}
                </h4>

                <ChapterList
                  chapters={book.chapters || []}
                  isRTL={isRTL}
                  getLinkHref={(chapter) => {
                    const firstPage =
                      chapter.pages?.length > 0
                        ? chapter.pages[0].number || 1
                        : 1;

                    return `/library/read/${slug}?page=${firstPage}`;
                  }}
                />
              </div>
            </div>

            {/* ABOUT AUTHOR */}
            <div className={activeSection === "author" ? "block" : "hidden"}>
              <SectionHeading title={t("details.aboutAuthor")} />

              <div className="mb-5 rounded-2xl bg-[#fffaf0] border border-[#eadca3] px-5 py-4">
                <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetaItem
                    label={t("details.author")}
                    value={book.author || "—"}
                  />

                  <MetaItem
                    label={t("details.birthYear")}
                    value={displayBirthYear}
                  />

                  <MetaItem
                    label={t("details.deathStatus")}
                    value={displayDeathYear}
                  />
                </div>

                <span className="text-[#334155]">{book.author || "—"}</span>
              </div>

              <p className="leading-8 whitespace-pre-line text-[#334155]">
                {book.authorBio?.trim()
                  ? book.authorBio
                  : t("details.noAuthorInfo")}
              </p>
            </div>

            {/* ABOUT BOOK */}
            <div className={activeSection === "book" ? "block" : "hidden"}>
              <SectionHeading title={t("details.aboutBook")} />

              <p className="leading-8 whitespace-pre-line text-[#334155]">
                {book.aboutBook?.trim()
                  ? book.aboutBook
                  : book.description?.trim()
                    ? book.description
                    : t("details.noBookInfo")}
              </p>
            </div>
          </section>
        </>
      </main>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <p className="m-0 rounded-2xl bg-[#fffaf0] border border-[#f0e6bd] px-4 py-3">
      <span className="font-bold text-[#5c4712]">{label}:</span>{" "}
      <span className="text-[#334155]">{value}</span>
    </p>
  );
}

function SectionHeading({ title }) {
  return (
    <div className="mb-6">
      <h3 className="text-[1.35rem] md:text-[1.5rem] font-bold text-[#5c4712]">
        {title}
      </h3>
    </div>
  );
}
