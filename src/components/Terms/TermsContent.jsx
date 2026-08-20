// src/components/Terms/TermsContent.jsx
import { getLocale, getTranslations } from "next-intl/server";

export default async function TermsContent() {
  const locale = await getLocale();
  const t = await getTranslations("terms");
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRTL = dir === "rtl";
  const sections = t.raw("sections");

  return (
    <main dir={dir} className="max-w-[900px] mx-auto my-10 px-5">
      <h1
        className={`
          text-[1.8rem] max-md:text-[1.5rem]
          font-bold mb-[15px]
          text-[var(--bg-color-header)]
          ${isRTL ? "text-right" : "text-left"}
        `}
      >
        {t("pageTitle")}
      </h1>

      {sections.map((sec) => (
        <section key={sec.id} className="mb-[2.2rem]">
          <h2
            className="
              text-[var(--bg-color-header)]
              mb-3 text-[1.25rem] max-md:text-[1.15rem]
              font-semibold pb-[0.4rem]
              border-b-2 border-[var(--bg-color-header)]
            "
          >
            {sec.title}
          </h2>

          <div
            className="leading-[1.65] text-[0.98rem]"
            dangerouslySetInnerHTML={{
              __html: sec.content.replace(/\n/g, "<br />"),
            }}
          />
        </section>
      ))}
    </main>
  );
}