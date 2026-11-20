import { getLocale } from "next-intl/server";

import { SITE_URL } from "@/lib/seo";
import { getBooks } from "@/services/library.service";
import HoverHadith from "@/components/Library/HoverHadith";
import LibraryButtons from "@/components/Library/LibraryButtons";
import BookShelf from "@/components/Library/BookShelf";

const CATEGORY_SHELVES = ["aqeedah", "hadith", "fiqh", "seerah"];
const REVALIDATE = 3600;

const unwrap = (result) =>
  result.status === "fulfilled"
    ? { books: result.value?.books || [], total: result.value?.total || 0 }
    : { books: [], total: 0 };

export default async function LibraryLanding() {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = await getTranslations("library");

  const [recentResult, ...categoryResults] = await Promise.allSettled([
    getBooks({
      lang: locale,
      limit: 8,
      sort: "newest",
      revalidate: REVALIDATE,
    }),
    ...CATEGORY_SHELVES.map((category) =>
      getBooks({ lang: locale, limit: 4, category, revalidate: REVALIDATE }),
    ),
  ]);

  const recent = unwrap(recentResult);

  const listSchema = recent.books.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: t("landing.recentlyAdded"),
        itemListElement: recent.books.map((book, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/${locale}/library/read/${book.slug}`,
          name: book.title,
        })),
      }
    : null;

  return (
    <div
      dir={dir}
      className="
        flex flex-1
        items-center justify-center
        p-8
        font-[var(--font-family)]
      "
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url("/books.jpeg")',
        backgroundSize: "auto",
        backgroundPosition: "center",
      }}
    >
      <main
        dir={dir}
        className="
          w-[95%]
          max-w-[95%]
          sm:max-w-[85%]
          md:max-w-[70%]
          lg:max-w-[55%]
          xl:max-w-[50%]

          px-6 py-10
          sm:px-10 sm:py-12

          mx-auto

          rounded-[12px]

          flex flex-col
          items-center justify-center

          text-center

          bg-[var(--bg-light)]
          text-[var(--text-main)]
        "
      >
        <h1 className="pt-[30px] pb-4 font-bold">
          <HoverHadith />
        </h1>

        <LibraryButtons />
      </main>
    </div>
  );
}
