"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const PAGE_TITLE_KEYS = {
  "/about": "about.headerTitle",
  "/feedback": "feedback.headerTitle",
  "/terms": "terms.headerTitle",
  "/contribute": "contribute.headerTitle",
  "/library": "library.headerTitle",
  "/books": "library.books.headerTitle",
};

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const pageTitleKey = PAGE_TITLE_KEYS[pathname];
  const subtitle = pageTitleKey ? t(pageTitleKey) : t("common.site.tagline");

  return (
    <header
      className={`
        px-6 py-5 text-center text-white md:px-8 md:py-6
        ${isRTL ? "font-arabic" : "font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]"}
        [background-image:radial-gradient(ellipse_at_top,rgba(255,255,255,0.22),transparent_60%),linear-gradient(180deg,#d4b93f_0%,#c3a421_60%,#a67f0f_100%)]
        border-b border-black/10 shadow-sm
      `}
    >
      <Link
        href="/"
        className="inline-block text-white no-underline hover:text-white"
      >
        <span
          className={`block text-[1.9rem] font-bold tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] md:text-[2.2rem] ${
            isRTL ? "leading-relaxed" : "leading-none"
          }`}
        >
          {t("common.site.name")}
        </span>
      </Link>

      <p className="mx-auto mt-2 max-w-xl text-balance text-sm text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] md:text-base">
        {subtitle}
      </p>
    </header>
  );
}
