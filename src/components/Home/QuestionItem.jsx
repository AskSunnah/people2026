import { Link } from "@/i18n/navigation";
import HighlightText from "./HighlightText";
import ShareButton from "@/components/Question/ShareButton";

// Used only when the API didn't provide a server snippet (e.g. the home list)
function fallbackExcerpt(answer = "", max = 150) {
  const clean = answer
    .replace(/\[\[?([^\]]*)\]\]?(\([^)]*\))?/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[#*_>`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max)) + "…";
}

// First valid date among the usual field names (never shows "Invalid Date")
const DATE_KEYS = ["date", "createdAt", "publishedAt", "updatedAt"];
function pickDate(item) {
  for (const key of DATE_KEYS) {
    if (!item[key]) continue;
    const d = new Date(item[key]);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

const QuestionItem = ({
  item,
  direction = "ltr",
  locale = "en",
  currentPage = 1,
  highlightQuery = "",
}) => {
  const isRTL = direction === "rtl";

  // Don't derive locale from item.lang: list endpoints are already
  // scoped to one language (see original comment). Use the list's locale.
  const backPage = currentPage > 1 ? `?page=${currentPage}` : "";

  const questionTitle = item.heading || item.question || "";

  // Search results: server-built snippet { text, ranges }
  // Other lists: fall back to a cleaned excerpt of the answer
  const hasServerSnippet = Boolean(item.snippet?.text);
  const snippetText = hasServerSnippet
    ? item.snippet.text
    : fallbackExcerpt(item.answer);

  const dateObj = pickDate(item);
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString(isRTL ? "ar" : "en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/questions/${item.slug}${backPage}`}
      locale={locale}
      dir={direction}
      className={`
        block
        mt-4 sm:mt-6
        p-3 sm:p-4
        rounded-[5px]
        no-underline
        transition-all duration-200
        border border-[#eee]
        bg-[#fefefe]
        text-[var(--text-main)]
        hover:bg-[var(--bg-secondary)]
        hover:cursor-pointer
        text-[0.9rem]
        leading-6
        sm:text-[1rem]
        break-words
        ${
          isRTL
            ? "border-r-[5px] border-r-[var(--bg-color-header)] text-right"
            : "border-l-[5px] border-l-[var(--bg-color-header)] text-left"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <span className="text-[0.9rem] sm:text-[1rem]">
          <HighlightText
            text={questionTitle}
            ranges={item.headingRanges}
            query={highlightQuery}
          />
        </span>
      </div>

      {snippetText && (
        <p className="text-[0.82rem] sm:text-[0.88rem] leading-relaxed text-gray-500 line-clamp-3 m-0">
          {hasServerSnippet ? (
            <HighlightText
              text={snippetText}
              ranges={item.snippet.ranges || []}
            />
          ) : (
            // no server ranges: only highlight if a query was passed
            <HighlightText text={snippetText} query={highlightQuery} />
          )}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between gap-3 text-[0.75rem] text-[var(--bg-color-header)]">
        <ShareButton
          variant="link"
          url={`/${locale}/questions/${item.slug}`}
          heading={questionTitle}
          label={isRTL ? "مشاركة" : "Share"}
          copiedMessage={isRTL ? "تم نسخ الرابط" : "Link copied"}
        />
        {formattedDate && (
          <span className="whitespace-nowrap">{formattedDate}</span>
        )}
      </div>
    </Link>
  );
};

export default QuestionItem;
