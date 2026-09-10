import { getLocale } from "next-intl/server";

import HoverHadith from "@/components/library/HoverHadith";
import LibraryButtons from "@/components/library/LibraryButtons";

export default async function LibraryLanding() {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      dir={dir}
      className="
        flex flex-1
        items-center justify-center
        p-8
        font-[var(--font-family)]
      "
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url("/books.jpeg")',
        backgroundSize: "auto",
        backgroundPosition: "center",
      }}
    >
      <main
        dir={dir}
        className="
          w-[95%]
          max-w-[95%]
          sm:max-w-[85%]
          md:max-w-[70%]
          lg:max-w-[55%]
          xl:max-w-[50%]

          px-6 py-10
          sm:px-10 sm:py-12

          mx-auto

          rounded-[12px]

          flex flex-col
          items-center justify-center

          text-center

          bg-[var(--bg-light)]
          text-[var(--text-main)]
        "
      >
        <h1 className="pt-[30px] pb-4 font-bold">
          <HoverHadith />
        </h1>

        <LibraryButtons />
      </main>
    </div>
  );
}
