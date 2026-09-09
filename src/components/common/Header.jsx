"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

const PAGE_TITLE_KEYS = {
  "/": "common.site.name",
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

  const titleKey = PAGE_TITLE_KEYS[pathname] ?? "common.site.name";

  const title = t(titleKey);
  const tagline = t("common.site.tagline");

  return (
    <header
      className="
        text-white
        py-8 md:py-7
        px-6 md:px-8

        font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]

        bg-[linear-gradient(180deg,#e1cb57_0%,#d0b640_30%,#c3a421_65%,#a67f0f_110%)]

        border-b
        border-black/10

        shadow-sm
      "
    >
      <div className="md:grid md:grid-cols-3 md:items-center">
        <div className="hidden md:block" />

        <div className="text-center">
          <div className="text-[2rem] md:text-[2.2rem] font-bold tracking-tight leading-none">
            {title}
          </div>

          <div className="mt-2 text-base md:text-lg text-white/90">
            <p>{tagline}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
