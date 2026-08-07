import { getTranslations } from "next-intl/server";

export default async function Header() {
  const t = await getTranslations("common.site");

  return (
    <header
      className="
        text-white py-8 md:py-7 px-6 md:px-8
        font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]
        bg-[linear-gradient(180deg,#e1cb57_0%,#d0b640_30%,#c3a421_65%,#a67f0f_110%)]
        border-b border-black/10 shadow-sm
      "
    >
      <div className="md:grid md:grid-cols-3 md:items-center">
        {/* Empty left column to balance right side */}
        <div className="hidden md:block" />

        {/* Centered site title */}
        <div className="text-center">
          <div className="text-3xl md:text-[2.8rem] font-black tracking-tight leading-none">
            {t("name")}
          </div>

          <div className="mt-2 text-base md:text-lg text-white/90">
            <p>{t("tagline")}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
