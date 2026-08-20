// src/components/Question/PinnedSidebar.jsx
//
// Server component: compact rail version of the homepage's PinnedSection,
// used alongside a question's content. Data is fetched server-side in
// page.js and passed in as props (same pattern as the homepage).
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Pin, ArrowRight } from "lucide-react";

export default async function PinnedSidebar({ sections = [], direction = "ltr" }) {
  if (!sections.length) return null;

  // Reuses the homepage's pinned translations (defaultTitle/readMore are
  // the same copy in both places) instead of duplicating the strings.
  const t = await getTranslations("home.pinned");
  const isRTL = direction === "rtl";

  return (
    <aside dir={direction} className="space-y-6">
      {sections.map((section) => (
        <div
          key={section.id}
          className="
            rounded-2xl border border-[#c3a421]/20
            bg-gradient-to-br from-[#fffdf7] via-white to-[#fff8dc]
            p-4 shadow-sm
          "
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#c3a421] flex items-center justify-center shadow-sm shrink-0">
              <Pin size={13} className="text-white" fill="white" />
            </div>
            <h3
              className={`m-0 text-[0.95rem] font-bold text-[var(--bg-color-header)] ${isRTL ? "text-right" : "text-left"}`}
            >
              {section.title || t("defaultTitle")}
            </h3>
          </div>

          <div className="flex flex-col gap-2">
            {(section.questions || []).map((q, i) => {
              const locale = q.lang === "ar" ? "ar" : "en";

              return (
                <Link
                  key={i}
                  href={`/questions/${q.slug}`}
                  locale={locale}
                  dir={direction}
                  className={`
                    group flex flex-col gap-1.5 rounded-xl bg-white
                    border border-gray-100 px-3.5 py-3
                    hover:border-[#c3a421]/40 hover:shadow-sm
                    transition-all duration-200 no-underline
                    ${isRTL ? "text-right" : "text-left"}
                  `}
                >
                  <p className="m-0 text-[0.85rem] font-semibold leading-snug text-[var(--text-main)] group-hover:text-[var(--bg-color-header)] transition-colors line-clamp-2">
                    {q.heading}
                  </p>

                  {q.snippet && (
                    <p className="m-0 text-[0.78rem] leading-relaxed text-gray-500 line-clamp-2">
                      {q.snippet}
                    </p>
                  )}

                  <div className="flex items-center gap-1">
                    <span className="text-[0.72rem] font-semibold text-[#c3a421] group-hover:text-[var(--bg-color-header)] transition-colors">
                      {t("readMore")}
                    </span>
                    <ArrowRight
                      size={11}
                      className="text-[#c3a421] group-hover:text-[var(--bg-color-header)] transition-colors"
                      style={isRTL ? { transform: "rotate(180deg)" } : undefined}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
