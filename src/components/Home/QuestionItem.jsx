import { Link } from "@/i18n/navigation";
import HighlightText from "./HighlightText";

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

  // IMPORTANT: don't derive locale from item.lang here. Recent-answers
  // and search-result items come from endpoints that are already
  // scoped to one language (/api/all, /api/ar/all, /api/search?lang=),
  // so individual items never carry their own `.lang` field — it's
  // implied by which page/list rendered them. Use the locale the list
  // itself was fetched with. (Pinned/related items are different: those
  // genuinely can mix languages within one section, and do carry a real
  // per-item `.lang` from the backend — see PinnedSection/PinnedSidebar.)
  const backPage = currentPage > 1 ? `?page=${currentPage}` : "";

  const questionTitle = item.heading || item.question || "";
  const snippet = item.answer ? item.answer.slice(0, 150).trim() : "";

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString(isRTL ? "ar" : "en", {
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
          <HighlightText text={questionTitle} query={highlightQuery} />
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

      {snippet && (
        <p className="text-[0.82rem] sm:text-[0.88rem] leading-relaxed text-gray-500 line-clamp-2 m-0">
          <HighlightText text={`${snippet}…`} query={highlightQuery} />
        </p>
      )}
    </Link>
  );
};

export default QuestionItem;
