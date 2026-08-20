"use client";

import { Link } from "@/i18n/navigation";

const IntroSection = ({ heading, description, buttonLabel, onOpenModal, locale, direction = "ltr" }) => {
  const otherLocale = locale === "ar" ? "en" : "ar";
  const switchLabel = locale === "ar" ? "English" : "العربية";

  return (
    <section
      aria-labelledby="ask-question"
      dir={direction === "rtl" ? "rtl" : "ltr"}
      className="mb-8 text-[var(--text-main)]"
    >
      <h2
        id="ask-question"
        className="py-2 text-[var(--bg-color-header)] text-[1.5rem] font-bold max-md:text-[1.5rem]"
      >
        {heading}
      </h2>

      <p>{description}</p>

      <div className="mt-4 flex items-center">
        <a
          href="#"
          id="openModalBtn"
          aria-label={buttonLabel}
          onClick={(e) => {
            e.preventDefault();
            onOpenModal();
          }}
          className="
            inline-block mt-4 px-6 py-3 rounded-md font-semibold no-underline
            text-[#3d3300]
            bg-gradient-to-br from-[#fff1b7] to-[#bea331]
            hover:from-[#fce490] hover:to-[#a88c1e]
            transition-all duration-300
          "
        >
          {buttonLabel}
        </a>

        <Link
          href="/"
          locale={otherLocale}
          className={`underline text-inherit ${direction === "rtl" ? "mr-4" : "ml-4"}`}
        >
          {switchLabel}
        </Link>
      </div>
    </section>
  );
};

export default IntroSection;
