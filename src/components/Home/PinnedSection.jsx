// Server component: renders admin-curated pinned sections. Data is
// fetched server-side in page.js and passed in as props, so this never
// shows a loading skeleton and is present in the initial HTML.
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Calendar, ArrowRight } from "lucide-react";

export default async function PinnedSection({ sections = [], direction = "ltr" }) {
  if (!sections.length) return null;

  const t = await getTranslations("home.pinned");
  const isRTL = direction === "rtl";

  return (
    <>
      {sections.map((section) => (
        <SelectedBlock
          key={section.id}
          section={section}
          direction={direction}
          isRTL={isRTL}
          t={t}
        />
      ))}
    </>
  );
}

function SelectedBlock({ section, direction, isRTL, t }) {
  const { title, questions = [] } = section;
  const isSingle = questions.length === 1;

  return (
    <section dir={direction} className="mb-8">
      <div className="rounded-3xl border border-[#c3a421]/20 bg-gradient-to-br from-[#fffdf7] via-white to-[#fff8dc] p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#c3a421] flex items-center justify-center shadow-sm shrink-0">
            <Calendar size={20} className="text-white" fill="white" />
          </div>

          <div className={isRTL ? "text-right" : "text-left"}>
            <h2 className="m-0 text-[1.1rem] md:text-[1.2rem] font-bold text-[var(--bg-color-header)]">
              {title || t("defaultTitle")}
            </h2>
            <p className="m-0 mt-1 text-sm text-gray-500">{t("subtitle")}</p>
          </div>
        </div>

        {isSingle ? (
          <FeaturedQuestion question={questions[0]} isRTL={isRTL} direction={direction} t={t} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q, i) => (
              <QuestionCard key={i} q={q} isRTL={isRTL} direction={direction} t={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedQuestion({ question: q, isRTL, direction, t }) {
  const locale = q.lang === "ar" ? "ar" : "en";

  return (
    <Link
      href={`/questions/${q.slug}`}
      locale={locale}
      dir={direction}
      className="
        group flex flex-col sm:flex-row items-stretch sm:items-center justify-between
        gap-4 rounded-2xl bg-white border border-gray-100 px-6 py-5 shadow-sm
        hover:shadow-md hover:border-[#c3a421]/40 transition-all duration-300 no-underline
      "
    >
      <div className={`flex flex-col gap-1.5 min-w-0 ${isRTL ? "text-right" : "text-left"}`}>
        <p className="m-0 text-[1.02rem] font-semibold leading-relaxed text-[var(--text-main)] group-hover:text-[var(--bg-color-header)] transition-colors">
          {q.heading}
        </p>
        {q.snippet && (
          <p className="m-0 text-[0.85rem] leading-relaxed text-gray-500 line-clamp-2">
            {q.snippet}
          </p>
        )}
      </div>

      <div className={`flex items-center gap-2 shrink-0 ${isRTL ? "self-start sm:self-auto" : "self-end sm:self-auto"}`}>
        <span className="text-[0.85rem] font-semibold text-[#c3a421] group-hover:text-[var(--bg-color-header)] transition-colors whitespace-nowrap">
          {t("readMore")}
        </span>
        <span className="w-8 h-8 rounded-lg bg-[#fff8dc] flex items-center justify-center shrink-0 group-hover:bg-[#c3a421] transition-colors">
          <ArrowRight
            size={15}
            className="text-[#c3a421] group-hover:text-white transition-colors"
            style={isRTL ? { transform: "rotate(180deg)" } : undefined}
          />
        </span>
      </div>
    </Link>
  );
}

function QuestionCard({ q, isRTL, direction, t }) {
  const locale = q.lang === "ar" ? "ar" : "en";

  return (
    <Link
      href={`/questions/${q.slug}`}
      locale={locale}
      dir={direction}
      className={`
        group flex flex-col gap-2.5 rounded-2xl bg-white border border-gray-100
        px-5 py-4 shadow-sm hover:shadow-md hover:border-[#c3a421]/40
        hover:-translate-y-[2px] transition-all duration-300 no-underline
        ${isRTL ? "text-right" : "text-left"}
      `}
    >
      <p className="m-0 text-[0.95rem] font-semibold leading-relaxed text-[var(--text-main)] group-hover:text-[var(--bg-color-header)] transition-colors line-clamp-2">
        {q.heading}
      </p>

      {q.snippet && (
        <p className="m-0 text-[0.82rem] leading-relaxed text-gray-500 line-clamp-2">
          {q.snippet}
        </p>
      )}

      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-[0.78rem] font-semibold text-[#c3a421] group-hover:text-[var(--bg-color-header)] transition-colors">
          {t("readMore")}
        </span>
        <span className="w-6 h-6 rounded-lg bg-[#fff8dc] flex items-center justify-center shrink-0 group-hover:bg-[#c3a421] transition-colors">
          <ArrowRight
            size={13}
            className="text-[#c3a421] group-hover:text-white transition-colors"
            style={isRTL ? { transform: "rotate(180deg)" } : undefined}
          />
        </span>
      </div>
    </Link>
  );
}
