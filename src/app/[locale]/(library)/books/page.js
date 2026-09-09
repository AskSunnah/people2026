import { getTranslations } from "next-intl/server";

import { getBooks, getAuthors } from "@/services/library.service";

import BookLibraryClient from "@/components/library/books/BookLibraryClient";

const LIMIT = 9;

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const lang = locale === "ar" ? "ar" : "en";

  const t = await getTranslations({
    locale: lang,
    namespace: "library.books",
  });

  return {
    title: t("seoTitle"),
    description: t("seoDescription"),

    alternates: {
      canonical: `/${lang}/books`,

      languages: {
        en: "/en/books",
        ar: "/ar/books",
      },
    },

    openGraph: {
      title: t("seoTitle"),
      description: t("seoDescription"),

      type: "website",

      url: `/${lang}/books`,

      locale: lang === "ar" ? "ar" : "en",
    },
  };
}

export default async function BooksPage({ params }) {
  const { locale } = await params;

  const lang = locale === "ar" ? "ar" : "en";

  const t = await getTranslations({
    locale: lang,
    namespace: "library.books",
  });

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
    <>
      <h1 className="sr-only">{t("headerTitle")}</h1>

      <BookLibraryClient
        lang={lang}
        initialBooks={booksData?.books || []}
        initialHasMore={Boolean(booksData?.hasMore)}
        initialAuthors={authors || []}
      />
    </>
  );
}
