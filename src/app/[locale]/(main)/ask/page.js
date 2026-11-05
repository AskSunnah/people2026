// src/app/[locale]/(main)/ask/page.js
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { getCategories } from "@/services/category.service";
import AskQuestionForm from "@/components/Home/AskQuestionForm";
import CategorySidebar from "@/components/Home/CategorySidebar";
import CategoryChips from "@/components/Home/CategoryChips";
import LibraryCard from "@/components/Home/LibraryCard";
import ContributeCard from "@/components/Home/ContributeCard";
import RightRail from "@/components/Home/Rightrail";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ask" });
  return buildMetadata({
    locale,
    path: "/ask",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function AskPage({ params, searchParams }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = await searchParams;
  const rawTopic = Array.isArray(query.topic) ? query.topic[0] : query.topic;
  const topic = rawTopic?.slice(0, 100) || "";

  const t = await getTranslations({ locale, namespace: "ask" });
  const direction = locale === "ar" ? "rtl" : "ltr";

  const categoriesResult = await getCategories(locale, true).catch(() => []);
  const categories = Array.isArray(categoriesResult) ? categoriesResult : [];

  return (
    <div className="mx-auto my-8 grid max-w-[1280px] items-start gap-6 px-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_260px] max-md:my-0 max-md:px-0">
      {/* Left rail (lg+) */}
      <aside className="sticky top-4 hidden lg:block">
        <CategorySidebar categories={categories} locale={locale} />
      </aside>

      <main
        dir={direction}
        className="min-w-0 rounded-[10px] bg-[var(--bg-main)] px-6 py-8 text-[var(--text-main)] shadow-[2px_3px_12px_rgba(0,0,0,0.14)] max-md:rounded-none max-md:px-4"
      >
        <h1 className="text-2xl font-bold text-[var(--bg-color-header)]">
          {t("heading")}
        </h1>
        <p className="mt-3 max-w-prose text-sm leading-7">
          {topic ? t("descriptionWithTopic", { topic }) : t("description")}
        </p>

        <div className="mt-6 max-w-[680px]">
          <AskQuestionForm locale={locale} direction={direction} />
        </div>

        {/* Below xl the right rail is hidden, so show its cards inline */}
        <div className="mt-8 space-y-4 xl:hidden">
          <LibraryCard locale={locale} />
          <ContributeCard locale={locale} />
        </div>

        {/* Below lg the left rail is hidden, so offer topics here */}
        <div className="mt-8">
          <CategoryChips categories={categories} locale={locale} />
        </div>
      </main>

      {/* Right rail (xl+) */}
      <aside className="sticky top-4 hidden xl:block">
        <RightRail locale={locale} />
      </aside>
    </div>
  );
}
