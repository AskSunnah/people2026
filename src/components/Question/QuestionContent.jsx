// src/components/Question/QuestionContent.jsx
import { Link } from "@/i18n/navigation";
import ShareButton from "./ShareButton";

// {{slug|label}} -> internal link (same locale as the current page)
// [[url|label]] -> external link, opens in a new tab
function renderTextWithRefs(text, key = 0) {
  const parts = text.split(/({{[^}]+\|[^}]+}}|\[\[[^\]]+\|[^\]]+\]\])/g);

  return parts.map((part, i) => {
    const internal = part.match(/^{{(.+?)\|(.+?)}}$/);
    const external = part.match(/^\[\[(.+?)\|(.+?)\]\]$/);

    if (internal) {
      const [, slug, label] = internal;
      return (
        <Link
          key={`${key}-${i}`}
          href={`/questions/${slug}`}
          className="text-[var(--bg-color-header)] underline underline-offset-2 font-medium hover:opacity-70 transition-opacity"
        >
          {label}
        </Link>
      );
    }

    if (external) {
      const [, url, label] = external;
      return (
        <a
          key={`${key}-${i}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--bg-color-header)] underline underline-offset-2 font-medium hover:opacity-70 transition-opacity"
        >
          {label}
        </a>
      );
    }

    return <span key={`${key}-${i}`}>{part}</span>;
  });
}

// Parses the answer's plain text into paragraphs, numbered sections with
// bullets, and standalone bullet lists.
function renderAnswer(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const numberedHeadingRegex = /^\d+[).]\s*/;
  const bulletRegex = /^[-•*]\s*/;
  const elements = [];
  let currentSection = null;

  lines.forEach((line) => {
    if (numberedHeadingRegex.test(line)) {
      if (currentSection) elements.push(currentSection);
      currentSection = {
        type: "section",
        heading: line.replace(numberedHeadingRegex, "").trim(),
        bullets: [],
      };
    } else if (bulletRegex.test(line)) {
      if (currentSection) {
        currentSection.bullets.push(line.replace(bulletRegex, "").trim());
      } else {
        elements.push({ type: "ul", items: [line.replace(bulletRegex, "").trim()] });
      }
    } else {
      if (currentSection) {
        elements.push(currentSection);
        currentSection = null;
      }
      elements.push(line);
    }
  });

  if (currentSection) elements.push(currentSection);

  let manualSectionCounter = 1;

  return elements.map((el, idx) => {
    if (typeof el === "string") {
      return (
        <p key={idx} className="whitespace-pre-wrap leading-[1.7] mb-4">
          {renderTextWithRefs(el, idx)}
        </p>
      );
    }

    if (el.type === "section") {
      const sectionNumber = manualSectionCounter++;
      return (
        <div key={idx} className="mb-6">
          <p className="text-[1.05em] font-medium mb-2">{`${sectionNumber}. ${el.heading}`}</p>
          <ul className="pl-6">
            {el.bullets.map((b, i) => (
              <li key={i} className="leading-[1.7]">
                {renderTextWithRefs(b, idx)}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (el.type === "ul") {
      return (
        <ul key={idx}>
          {el.items.map((item, i) => (
            <li key={i} className="leading-[1.7]">
              {renderTextWithRefs(item, idx)}
            </li>
          ))}
        </ul>
      );
    }

    return null;
  });
}

export default function QuestionContent({ data, direction, locale, t, backHref }) {
  const isRTL = direction === "rtl";

  const sectionTitleMap = {
    quran: t("fromQuran"),
    sunnah: t("fromSunnah"),
    salaf: t("fromSalaf"),
    scholar: t("fromScholars"),
    normal: "",
  };

  return (
    <div
      dir={direction}
      lang={locale}
      className="
        p-8 text-[17px]
        max-[768px]:p-6 max-[768px]:text-[16px]
        max-[480px]:p-4 max-[480px]:text-[15px]
      "
    >
      <h1
        className={`
          text-[var(--bg-color-header)] text-[2rem] leading-[1.5] mb-5 font-bold
          max-[768px]:text-[1.6rem] max-[768px]:mb-4
          max-[480px]:text-[1.3rem] max-[480px]:leading-[1.4] max-[480px]:mb-3
          ${isRTL ? "text-right" : "text-left"}
        `}
      >
        {data.heading}
      </h1>

      <div className={`flex mb-5 ${isRTL ? "justify-start" : "justify-end"}`}>
        <ShareButton
          heading={data.heading}
          shareText={t("shareText")}
          copiedMessage={t("linkCopied")}
        />
      </div>

      <p className={`mb-5 leading-[1.8] ${isRTL ? "text-right" : "text-left"}`}>
        <strong>{t("question")}</strong> <span>{data.question}</span>
      </p>

      {data.conclusion && (
        <div className="mb-6">
          <h2 className="text-[1.05em] font-bold text-[#c3a421] mb-2">{t("conclusion")}</h2>
          <div
            className="p-5 rounded-2xl border-2 border-[rgba(195,164,33,0.5)] shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
            style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
          >
            <p className="m-0 leading-[1.7] text-[#2b2b2b] whitespace-pre-wrap">
              {renderTextWithRefs(data.conclusion, 0)}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className={`mb-4 leading-[1.8] ${isRTL ? "text-right" : "text-left"}`}>
          <strong>{t("answer")}</strong>
        </p>
        {data.answer && renderAnswer(data.answer)}
      </div>

      <div id="dynamic-content">
        {data.content?.map((section, idx) => {
          const sectionTitle = sectionTitleMap[section.type] || "";

          if (section.type === "normal") {
            return (
              <p key={idx} className="whitespace-pre-wrap leading-[1.7] mb-4">
                {renderTextWithRefs(section.text, idx)}
              </p>
            );
          }

          const items = Array.isArray(section.items) ? section.items : [section];

          return (
            <div key={idx}>
              {sectionTitle && (
                <h2
                  className={`
                    text-[var(--bg-color-header)] mt-8 mb-4 text-[1.15em] font-bold
                    max-[480px]:mt-5 max-[480px]:mb-3
                    ${isRTL ? "text-right" : "text-left"}
                  `}
                >
                  {sectionTitle}
                </h2>
              )}
              <ul className="ps-5 list-disc">
                {items.map((item, i) => (
                  <li key={i} className="mb-6">
                    {item.reference && (
                      <strong className={`block mb-2 text-[0.9em] ${isRTL ? "text-right" : "text-left"}`}>
                        {item.reference}
                      </strong>
                    )}
                    {item.narrator && (
                      <em className={`block mb-2 text-[0.875em] ${isRTL ? "text-right" : "text-left"}`}>
                        {item.narrator}
                      </em>
                    )}
                    <blockquote
                      className={`
                        bg-[var(--bg-light)] border-s-[5px] border-[var(--bg-color-header)]
                        my-5 px-5 py-4 italic mb-2
                        max-[480px]:px-4 max-[480px]:py-3 max-[480px]:my-4
                        ${isRTL ? "text-right" : "text-left"}
                      `}
                    >
                      {renderTextWithRefs(item.text, idx)}
                    </blockquote>
                    {item.commentary && (
                      <p className="whitespace-pre-wrap leading-[1.7] mb-4">
                        {renderTextWithRefs(item.commentary, idx)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-[#c3a421] my-8 opacity-60" />

      <p>
        <strong>{t("andAllahKnowsBest")}</strong>
      </p>

      <Link
        href={backHref}
        className="inline-block mt-8 text-[var(--bg-color-header)] no-underline font-bold hover:underline"
      >
        {t("back")}
      </Link>
    </div>
  );
}
