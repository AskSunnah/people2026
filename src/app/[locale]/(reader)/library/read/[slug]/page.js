import { notFound } from "next/navigation";

import { getBook } from "@/services/library.service";
import BookReaderClient from "@/components/library/reader/BookReaderClient";

function createDescription(book, lang) {
  const source = book?.aboutBook?.trim() || book?.description?.trim() || "";

  if (source) {
    const clean = source.replace(/\s+/g, " ").trim();

    return clean.length > 160 ? `${clean.slice(0, 157)}...` : clean;
  }

  return lang === "ar"
    ? `اقرأ كتاب ${book.title} في مكتبة AskSunnah.`
    : `Read ${book.title} in the AskSunnah Library.`;
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;

  const lang = locale === "ar" ? "ar" : "en";

  const book = await getBook(lang, slug);

  if (!book) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = createDescription(book, lang);

  return {
    title:
      lang === "ar"
        ? `قراءة ${book.title} | AskSunnah`
        : `Read ${book.title} | AskSunnah`,

    description,

    /*
     * Reader pages are interactive application pages.
     *
     * ?page=1, ?page=2 etc. currently change page
     * client-side, so we do not want search engines
     * indexing these URLs independently.
     */
    robots: {
      index: false,
      follow: true,
    },

    openGraph: {
      title: `${book.title} | AskSunnah`,
      description,
      type: "website",
    },
  };
}

export default async function ReadBookPage({ params }) {
  const { locale, slug } = await params;

  const lang = locale === "ar" ? "ar" : "en";

  const book = await getBook(lang, slug);

  if (!book) {
    notFound();
  }

  /*
   * Flatten chapter pages while retaining their
   * chapter/page indexes for sidebar + reporting.
   */
  const pages = [];

  (book.chapters || []).forEach((chapter, chapterIndex) => {
    (chapter.pages || []).forEach((page, pageIndex) => {
      pages.push({
        ...page,
        chapterIndex,
        pageIndex,
      });
    });
  });

  const preparedBook = {
    ...book,
    pages,
  };

  return <BookReaderClient book={preparedBook} lang={lang} slug={slug} />;
}
