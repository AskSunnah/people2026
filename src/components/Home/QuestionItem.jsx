import { Link } from "@/i18n/navigation";
import HighlightText from "./HighlightText";

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

const QuestionItem = ({
  item,
  index,
  labelPrefix = "Q",
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

  const dateValue = item.date || item.createdAt;
  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString(isRTL ? "ar" : "en", {
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
          <strong>
            {labelPrefix}
            {index + 1}:
          </strong>{" "}
          <HighlightText
            text={questionTitle}
            ranges={item.headingRanges}
            query={highlightQuery}
          />
        </span>

        {(formattedDate || item.category) && (
          <span
            className="
              shrink-0 whitespace-nowrap
              text-[0.72rem] font-medium
              text-[var(--bg-color-header)]
              bg-[var(--bg-color-header)]/10
              px-2 py-0.5 rounded-full
            "
          >
            {item.category || formattedDate}
          </span>
        )}
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
    </Link>
  );
};

export default QuestionItem;
