// src/components/Question/RelatedAnswersSidebar.jsx
//
// Server component: shown below PinnedSidebar so the two stack as one
// continuous "more to read" rail. relatedData/relatedQuestions are
// already fetched server-side in page.js.
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function RelatedAnswersSidebar({
  relatedData = [],
  relatedQuestions = [],
  direction = "ltr",
}) {
  if (!relatedData.length) return null;

  const t = await getTranslations("question");
  const isRTL = direction === "rtl";

  return (
    <div
      dir={direction}
      className="rounded-2xl border border-[rgba(40,115,70,0.15)] bg-[#fafcfb] p-4 shadow-sm"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-[var(--bg-color-header)] flex items-center justify-center shadow-sm shrink-0">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <h3
          className={`m-0 text-[0.95rem] font-bold text-[var(--bg-color-header)] ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("relatedAnswers")}
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {relatedData.map((item, i) => {
          const rq = relatedQuestions?.[i];
          if (!rq) return null;

          // Each related item keeps its own language's label, since a
          // related question can belong to a different locale than the
          // page it's shown on — this mirrors the original component.
          const isCardRTL = rq.lang === "ar";
          const cardLocale = rq.lang === "ar" ? "ar" : "en";
          const readMoreLabel = isCardRTL ? "اقرأ الإجابة كاملة" : "Read full answer";

          return (
            <Link
              key={i}
              href={`/questions/${rq.slug}`}
              locale={cardLocale}
              dir={isCardRTL ? "rtl" : "ltr"}
              className={`
                group flex flex-col gap-1.5 rounded-xl bg-white
                border border-gray-100 px-3.5 py-3
                hover:border-[var(--bg-color-header)]/40 hover:shadow-sm
                transition-all duration-200 no-underline
                ${isCardRTL ? "text-right" : "text-left"}
              `}
            >
              <p className="m-0 text-[0.85rem] font-semibold leading-snug text-[var(--text-main)] group-hover:text-[var(--bg-color-header)] transition-colors line-clamp-2">
                {item.heading}
              </p>

              {item.question && (
                <p className="m-0 text-[0.78rem] leading-relaxed text-gray-500 line-clamp-2">
                  {item.question}
                </p>
              )}

              <div className="flex items-center gap-1">
                <span className="text-[0.72rem] font-semibold text-[var(--bg-color-header)] transition-colors whitespace-nowrap">
                  {readMoreLabel}
                </span>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--bg-color-header)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={isCardRTL ? { transform: "rotate(180deg)" } : undefined}
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
