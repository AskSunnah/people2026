import { notFound } from "next/navigation";

import { getBook } from "@/services/library.service";
import BookReaderClient from "@/components/library/reader/BookReaderClient";

export default async function ReadBookPage({ params }) {
  const { locale, slug } = await params;

  const lang = locale === "ar" ? "ar" : "en";

  const book = await getBook(lang, slug);

  if (!book) {
    notFound();
  }

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
