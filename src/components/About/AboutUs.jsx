// src/components/About/AboutUs.jsx
import { getLocale, getTranslations } from "next-intl/server";

export default async function AboutUs() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRTL = dir === "rtl";

  const aimsPoints = t.raw("aims.points");
  const methodologyPoints = t.raw("methodology.points");

  const cardClass = `
    bg-[var(--bg-main)]
    ${isRTL ? "border-r-[5px]" : "border-l-[5px]"}
    border-[var(--bg-color-header)]
    rounded-[8px] p-[1.5rem]
    shadow-[0_3px_8px_rgba(0,0,0,0.05)]
    mb-6
    [&_h2]:text-[var(--text-accent)] [&_h2]:mb-3 [&_h2]:font-bold [&_h2]:text-[24px]
    [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mt-2
  `;

  return (
    <main dir={dir} className="max-w-[900px] mx-auto my-8 px-4">
      <section className={cardClass}>
        <h2>{t("vision.title")}</h2>
        <p>{t("vision.text")}</p>
      </section>

      <section className={cardClass}>
        <h2>{t("mission.title")}</h2>
        <p>{t("mission.text")}</p>
      </section>

      <section className={cardClass}>
        <h2>{t("aims.title")}</h2>
        <ul>
          {aimsPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </section>

      <section className={cardClass}>
        <h2>{t("methodology.title")}</h2>
        <p>{t("methodology.text")}</p>
        <ul>
          {methodologyPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </section>

      <section className={cardClass}>
        <h2>{t("bio.title")}</h2>
        <p>{t("bio.text")}</p>
      </section>

      <div
        className="
        bg-[var(--bg-main)] rounded-[8px] p-5 mt-8
        italic shadow-[0_2px_5px_rgba(0,0,0,0.05)]
        text-center text-[1.05rem]
      "
      >
        {t("dua")}
      </div>
    </main>
  );
}