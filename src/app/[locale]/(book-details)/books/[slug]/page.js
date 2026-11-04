import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/seo";
import { getBook } from "@/services/library.service";
import BookDetailsClient from "@/components/Library/details/BookDetailsClient";

function cleanText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function createDescription(book, lang) {
  const source = cleanText(
    book?.aboutBook || book?.description || book?.authorBio || "",
  );

  if (source) {
    return source.length > 160 ? `${source.slice(0, 157)}...` : source;
  }

  return lang === "ar"
    ? `اقرأ معلومات عن كتاب ${book.title} في مكتبة AskSunnah.`
    : `Read information about ${book.title} in the AskSunnah Library.`;
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
    title: `${book.title} | AskSunnah`,

    description,

    alternates: {
      canonical: `/${lang}/books/${slug}`,
    },

    openGraph: {
      title: `${book.title} | AskSunnah`,
      description,
      type: "website",
      url: `/${lang}/books/${slug}`,
      locale: lang === "ar" ? "ar" : "en",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BookDetailsPage({ params }) {
  const { locale, slug } = await params;

  const lang = locale === "ar" ? "ar" : "en";

  const book = await getBook(lang, slug);

  if (!book) {
    notFound();
  }

  const t = await getTranslations({
    locale: lang,
    namespace: "library",
  });

  const description = createDescription(book, lang);

  const totalPages =
    book?.chapters?.reduce(
      (total, chapter) => total + (chapter.pages?.length || 0),
      0,
    ) || 0;

const bookUrl = `${SITE_URL}/${lang}/books/${slug}`;

const bookSchema = {
  "@context": "https://schema.org",
  "@type": "Book",
  "@id": `${bookUrl}#book`,
  name: book.title,

  ...(book.author && {
    author: {
      "@type": "Person",
      name: book.author,
    },
  }),

  description,
  inLanguage: book.language || lang,

  ...(totalPages > 0 && {
    numberOfPages: totalPages,
  }),

  url: bookUrl,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",

  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: lang === "ar" ? "الرئيسية" : "Home",
      item: `${SITE_URL}/${lang}`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: t("headerTitle"),
      item: `${SITE_URL}/${lang}/library`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: t("books.headerTitle"),
      item: `${SITE_URL}/${lang}/books`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: book.title,
      item: bookUrl,
    },
  ],
};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bookSchema).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <BookDetailsClient book={book} lang={lang} slug={slug} />
    </>
  );
}
