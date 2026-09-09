import { getBooks, getAuthors } from "@/services/library.service";

import BookLibraryClient from "@/components/Library/BookLibraryClient";

const LIMIT = 9;

export default async function BooksPage({ params }) {
  const { locale } = await params;

  const lang = locale === "ar" ? "ar" : "en";

  const [booksData, authors] = await Promise.all([
    getBooks({
      lang,
      page: 1,
      limit: LIMIT,
      search: "",
      category: "all",
      author: "all",
      sort: "author_timeline_asc",
    }),

    getAuthors(lang),
  ]);

  return (
    <BookLibraryClient
      lang={lang}
      initialBooks={booksData?.books || []}
      initialHasMore={Boolean(booksData?.hasMore)}
      initialAuthors={authors || []}
    />
  );
}
