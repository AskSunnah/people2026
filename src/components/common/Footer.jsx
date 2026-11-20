// src/components/common/Footer.jsx
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCategories } from "@/services/category.service";

const socialLinks = [
  {
    href: "https://www.youtube.com/@falah.kurkully",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          fill="currentColor"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8Z"
        />
        <path fill="#fff" d="M9.6 15.5v-7l6.1 3.5-6.1 3.5Z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@falah.kurkully",
    label: "TikTok",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <path d="M16.5 1a5.51 5.51 0 0 0 4.5 2V6a7.5 7.5 0 0 1-4.5-1.5V14a6.5 6.5 0 1 1-6.5-6.5c.5 0 1 .07 1.5.2v2.16a3.5 3.5 0 1 0 2 3.14V1h3z" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com/falah.kurkully",
    label: "Instagram",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 2.5A5.5 5.5 0 0 0 6.5 12 5.5 5.5 0 0 0 12 17.5 5.5 5.5 0 0 0 17.5 12 5.5 5.5 0 0 0 12 6.5zm0 2A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm4.75-2a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75z" />
      </svg>
    ),
  },
];

async function getTopCategories(locale) {
  try {
    const all = await getCategories(locale, true);
    return [...all].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 6);
  } catch {
    return [];
  }
}

const linkClass =
  "text-sm text-[var(--text-main)] no-underline transition-colors hover:text-[#8a6d00] hover:underline focus-visible:outline-2 focus-visible:outline-[#c8aa35]";
const headingClass =
  "m-0 mb-4 text-sm font-semibold uppercase tracking-wider !text-[#8a6d00]";

export default async function Footer() {
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const t = await getTranslations("common");
  const year = new Date().getFullYear();
  const topics = await getTopCategories(locale);

  const L = isRTL
    ? {
        explore: "استكشف",
        home: "الرئيسية",
        ask: "اطرح سؤالًا",
        categories: "التصنيفات",
        about: "من نحن",
        feedback: "ملاحظاتك",
        contribute: "ساهم معنا",
        topics: "المواضيع",
        all: "كل التصنيفات",
        libTitle: "المكتبة",
        libText:
          "كتب إسلامية بالعربية والإنجليزية، مجانًا للقراءة عبر الإنترنت.",
        libCta: "تصفح المكتبة",
      }
    : {
        explore: "Explore",
        home: "Home",
        ask: "Ask a question",
        categories: "Categories",
        about: "About us",
        feedback: "Feedback",
        contribute: "Contribute",
        topics: "Topics",
        all: "All categories",
        libTitle: "The Library",
        libText: "Islamic books in Arabic and English, free to read online.",
        libCta: "Browse the library",
      };

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className={`border-t border-[#e9dfbd] bg-orange-50 text-[var(--text-main)] ${isRTL ? "font-arabic" : ""}`}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 no-underline"
            >
              {/* TODO: replace with your real logo path */}
              <Image
                src="\Ask Sunnah (Gold Logo).svg"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
              <span className="text-2xl font-bold text-[#8a6d00]">
                {t("site.name")}
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-600">
              {t("site.tagline")}
            </p>

            <div className="mt-5 flex gap-2.5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e9dfbd]
                    text-[#8a6d00] transition-colors hover:border-[#c8aa35] hover:bg-[#fff6d8]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label={L.explore}>
            <h3 className={headingClass}>{L.explore}</h3>
            <ul className="m-0 list-none space-y-2.5 p-0">
              <li>
                <Link href="/" className={linkClass}>
                  {L.home}
                </Link>
              </li>
              <li>
                <Link href="/ask" className={linkClass}>
                  {L.ask}
                </Link>
              </li>
              <li>
                <Link href="/categories" className={linkClass}>
                  {L.categories}
                </Link>
              </li>
              <li>
                <Link href="/about" className={linkClass}>
                  {L.about}
                </Link>
              </li>
              <li>
                <Link href="/feedback" className={linkClass}>
                  {L.feedback}
                </Link>
              </li>
              <li>
                <Link href="/contribute" className={linkClass}>
                  {L.contribute}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Topics */}
          {topics.length > 0 && (
            <nav aria-label={L.topics}>
              <h3 className={headingClass}>{L.topics}</h3>
              <ul className="m-0 list-none space-y-2.5 p-0">
                {topics.map((c) => (
                  <li key={c._id}>
                    <Link href={`/categories/${c.path}`} className={linkClass}>
                      {c.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/categories"
                    className="text-sm font-semibold text-[#a88700] no-underline hover:underline"
                  >
                    {L.all}
                  </Link>
                </li>
              </ul>
            </nav>
          )}

          {/* Library: same gold card as the home page rail */}
          <section
            aria-labelledby="footer-library"
            className="relative self-start overflow-hidden rounded-xl bg-gradient-to-b from-[#c9a82a] to-[#a98a14] p-5 text-white shadow-[0_2px_10px_rgba(120,90,0,0.25)]"
          >
            <div
              aria-hidden="true"
              className="absolute bottom-0 end-4 flex items-end gap-1 opacity-30"
            >
              <span className="h-10 w-2.5 rounded-t-sm bg-white" />
              <span className="h-16 w-2.5 rounded-t-sm bg-white" />
              <span className="h-12 w-2.5 rounded-t-sm bg-white" />
              <span className="h-20 w-2.5 rounded-t-sm bg-white" />
            </div>
            <h3
              id="footer-library"
              className="relative m-0 mb-1 text-lg font-bold !text-white"
            >
              {L.libTitle}
            </h3>
            <p className="relative m-0 max-w-[15rem] text-sm leading-6 text-white/90">
              {L.libText}
            </p>
            <Link
              href="/library"
              className="relative mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#7a6100] no-underline hover:bg-[#fff6d8]"
            >
              {L.libCta}
            </Link>
          </section>
        </div>
      </div>

      {/* Bottom bar: gold, ties back to the header */}
      <div className="bg-gradient-to-b from-[#d4b93f] to-[#c3a421]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-6 py-3.5 text-xs text-[#2b2410] sm:flex-row">
          <span>{t("footer.copyright", { year })}</span>
          <Link
            href="/terms"
            className="text-[#2b2410] underline-offset-2 hover:underline"
          >
            {t("footer.terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
