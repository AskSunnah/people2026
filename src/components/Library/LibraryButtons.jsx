// src/components/Library/LibraryButtons.jsx
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LibraryButtons() {
  const locale = useLocale();
  const t = useTranslations("library.landing");
  const isArabic = locale === "ar";

  const cls =
    "lib-button inline-flex h-[50px] w-full min-w-[180px] items-center justify-center rounded-[6px] px-6 text-[1.05rem] font-semibold no-underline transition-all sm:w-auto sm:text-[1.1rem]";

  return (
    <div className="mt-6 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
      <Link href="/books" className={cls}>
        {isArabic ? t("arabicBooks") : t("englishBooks")}
      </Link>
      <Link href="/books" locale={isArabic ? "en" : "ar"} className={cls}>
        {isArabic ? t("englishBooks") : t("arabicBooks")}
      </Link>
    </div>
  );
}
