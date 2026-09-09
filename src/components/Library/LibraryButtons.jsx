"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function LibraryButtons() {
  const locale = useLocale();
  const router = useRouter();

  const t = useTranslations("library.landing");

  const isArabic = locale === "ar";

  const handleCurrentLanguageBooks = () => {
    router.push("/books");
  };

  const handleOtherLanguageBooks = () => {
    router.push("/books", {
      locale: isArabic ? "en" : "ar",
    });
  };

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-3 mt-6">
      <button
        type="button"
        onClick={handleCurrentLanguageBooks}
        className="lib-button w-full sm:w-auto min-w-[180px] h-[50px] px-6 font-semibold text-[1.05rem] sm:text-[1.1rem] rounded-[6px] cursor-pointer transition-all"
      >
        {isArabic ? t("arabicBooks") : t("englishBooks")}
      </button>

      <button
        type="button"
        onClick={handleOtherLanguageBooks}
        className="lib-button w-full sm:w-auto min-w-[180px] h-[50px] px-6 font-semibold text-[1.05rem] sm:text-[1.1rem] rounded-[6px] cursor-pointer transition-all"
      >
        {isArabic ? t("englishBooks") : t("arabicBooks")}
      </button>
    </div>
  );
}
