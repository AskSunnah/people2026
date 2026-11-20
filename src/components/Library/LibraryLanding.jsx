import { getLocale, getTranslations } from "next-intl/server";

import HoverHadith from "@/components/Library/HoverHadith";
import LibraryButtons from "@/components/Library/LibraryButtons";
import LibraryShelf from "@/components/Library/LibraryShelf";

import { getBooks } from "@/services/library.service";

const MAIN_COUNT = 6;
const SIDE_COUNT = 4;

const fetchPreview = (lang, limit) =>
  getBooks({
    lang,
    page: 1,
    limit,
    search: "",
    category: "all",
    author: "all",
    sort: "author_timeline_asc",
  }).catch(() => null);

export default async function LibraryLanding() {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  // main column = current language, side column = the other one
  const mainLang = locale === "ar" ? "ar" : "en";
  const sideLang = mainLang === "ar" ? "en" : "ar";

  const [t, tMain, tSide, main, side] = await Promise.all([
    getTranslations("library.landing"),
    getTranslations({ locale: mainLang, namespace: "library.landing" }),
    getTranslations({ locale: sideLang, namespace: "library.landing" }),
    fetchPreview(mainLang, MAIN_COUNT),
    fetchPreview(sideLang, SIDE_COUNT),
  ]);

  const title = (tr, lang) =>
    tr(lang === "ar" ? "arabicTitle" : "englishTitle");
  const browse = (tr, lang) =>
    tr(lang === "ar" ? "browseArabic" : "browseEnglish");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [...(main?.books || []), ...(side?.books || [])].map(
      (b, i) => ({ "@type": "ListItem", position: i + 1, name: b.title }),
    ),
  };

  return (
    <div
      dir={dir}
      className="flex flex-1 flex-col items-center gap-8 px-4 pb-12 pt-12 sm:px-8 sm:pt-16 font-[var(--font-family)]"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url("/books.jpeg")',
        backgroundSize: "auto",
        backgroundPosition: "center",
      }}
    >
      {/* WELCOME */}
      <h1 className="px-4 text-center font-bold">
        <HoverHadith />
      </h1>

      {/* SEARCH */}
      <div className="w-full max-w-6xl rounded-2xl px-5 py-4 shadow-xl">
        <form
          action={`/${locale}/books`}
          method="get"
          role="search"
          className="mx-auto flex w-full max-w-2xl overflow-hidden rounded-md border border-[#e3d28a] bg-white"
        >
          <input
            type="search"
            name="search"
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
          />
          <button
            type="submit"
            className="bg-[#c9a227] px-5 text-sm font-semibold text-white hover:brightness-95"
          >
            {t("search")}
          </button>
        </form>
      </div>

      {/* MAIN (current language) + SIDE (other language) */}
      <div className="grid w-full max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LibraryShelf
            title={title(tMain, mainLang)}
            books={main?.books}
            total={main?.total ? tMain("count", { count: main.total }) : null}
            browseLabel={browse(tMain, mainLang)}
            lang={mainLang}
            actions={
              <LibraryButtons
                lang={mainLang}
                label={tMain(
                  mainLang === "ar" ? "viewAllArabic" : "viewAllEnglish",
                )}
              />
            }
          />
        </div>

        <LibraryShelf
          compact
          title={title(tSide, sideLang)}
          books={side?.books}
          total={side?.total ? tSide("count", { count: side.total }) : null}
          browseLabel={browse(tSide, sideLang)}
          lang={sideLang}
          actions={
            <LibraryButtons
              lang={sideLang}
              label={tSide(
                sideLang === "ar" ? "viewAllArabic" : "viewAllEnglish",
              )}
            />
          }
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
