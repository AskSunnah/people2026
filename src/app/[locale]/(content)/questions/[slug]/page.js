
// src/app/[locale]/(content)/questions/[slug]/page.js
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { getQuestionBySlug } from "@/services/question.service";
import { getPinnedSections } from "@/services/pinned.service";

import { ReportableContent } from "@/components/Question/ReportableContent";
import QuestionContent from "@/components/Question/QuestionContent";
import QuestionSearchBar from "@/components/Question/QuestionSearchBar";
import PinnedSidebar from "@/components/Question/PinnedSidebar";
import RelatedAnswersSidebar from "@/components/Question/RelatedAnswersSidebar";

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const data = await getQuestionBySlug(slug, locale);

  if (!data) return {};

  const description = (data.conclusion || data.answer || "").slice(0, 160);

  return {
    title: data.heading,
    description,
    openGraph: {
      title: data.heading,
      description,
      locale,
    },
  };
}

export default async function QuestionDetailPage({ params, searchParams }) {
  const { locale, slug } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  const direction = locale === "ar" ? "rtl" : "ltr";
  const data = await getQuestionBySlug(slug, locale);

  if (!data) {
    notFound();
  }

  const t = await getTranslations("question");

  const [relatedResult, pinnedResult] = await Promise.allSettled([
    Promise.all(
      (data.relatedQuestions || []).map((rq) => getQuestionBySlug(rq.slug, rq.lang)),
    ),
    getPinnedSections(locale),
  ]);

  const relatedData =
    relatedResult.status === "fulfilled" ? relatedResult.value.filter(Boolean) : [];

  const pinnedSections =
    pinnedResult.status === "fulfilled" && pinnedResult.value?.active
      ? pinnedResult.value.sections || []
      : [];

  const hasRelated = relatedData.length > 0;
  const hasPinned = pinnedSections.length > 0;

  const backPage = sp?.page;
  const backHref = backPage ? { pathname: "/", query: { page: backPage } } : "/";

  return (
    <>
      <div className="sticky top-0 z-20 bg-[var(--bg-main)] max-w-[1320px] mx-auto px-4 pt-4 pb-3 max-[768px]:px-3">
        <QuestionSearchBar direction={direction} placeholder={t("searchPlaceholder")} />
      </div>

      <div
        dir="ltr"
        className={`
          max-w-[1320px] mx-auto mt-2 px-4
          flex flex-col gap-10 lg:items-start
          ${isRTLFlexClass(direction)}
          max-[768px]:mt-2 max-[768px]:px-3
        `}
      >
        <ReportableContent
          lang={locale}
          contentType="question"
          slug={slug}
          className="flex-1 min-w-0 lg:min-w-[600px]"
        >
          <QuestionContent
            data={data}
            direction={direction}
            locale={locale}
            t={t}
            backHref={backHref}
          />
        </ReportableContent>

        {(hasPinned || hasRelated) && (
          <div className="w-full lg:w-[300px] shrink-0 mb-10 lg:mb-0 lg:pt-2 space-y-6">
            {hasPinned && <PinnedSidebar sections={pinnedSections} direction={direction} />}
            {hasRelated && (
              <RelatedAnswersSidebar
                relatedData={relatedData}
                relatedQuestions={data.relatedQuestions}
                direction={direction}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

function isRTLFlexClass(direction) {
  return direction === "rtl" ? "lg:flex-row-reverse" : "lg:flex-row";
}
