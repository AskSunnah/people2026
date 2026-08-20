// src/components/common/Footer.jsx
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const socialLinks = [
  {
    href: "https://www.youtube.com/@falah.kurkully",
    label: "YouTube",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="white"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8Z"
        />

        <path fill="#c3a421" d="M9.6 15.5v-7l6.1 3.5-6.1 3.5Z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@falah.kurkully",
    label: "TikTok",
    icon: (
      <svg
        aria-hidden="true"
        width="28"
        height="28"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M16.5 1a5.51 5.51 0 0 0 4.5 2V6a7.5 7.5 0 0 1-4.5-1.5V14a6.5 6.5 0 1 1-6.5-6.5c.5 0 1 .07 1.5.2v2.16a3.5 3.5 0 1 0 2 3.14V1h3z" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com/falah.kurkully",
    label: "Instagram",
    icon: (
      <svg
        aria-hidden="true"
        width="28"
        height="28"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 2.5A5.5 5.5 0 0 0 6.5 12 5.5 5.5 0 0 0 12 17.5 5.5 5.5 0 0 0 17.5 12 5.5 5.5 0 0 0 12 6.5zm0 2A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm4.75-2a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75z" />
      </svg>
    ),
  },
];

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="
        relative overflow-hidden
        bg-[linear-gradient(180deg,#e1cb57_0%,#d0b640_30%,#c3a421_65%,#a67f0f_100%)]
        px-4 pb-4 pt-6
        text-center text-white
        sm:px-6
      "
    >
      <div className="absolute inset-x-0 top-0 h-[15px] bg-gradient-to-b from-white/20 to-transparent" />

      <div className="relative flex flex-col items-center gap-3 text-center">
        <h2 className="mb-0 text-[1.5rem] font-bold text-white sm:text-[2rem]">
          {t("site.name")}
        </h2>

        <p className="max-w-[600px] break-words px-2 text-[0.82rem] text-[#f0f0f0] sm:text-[0.95rem]">
          {t("site.tagline")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="
                inline-block
                transition-transform duration-300 ease-in-out
                hover:scale-125
                hover:drop-shadow-[0_0_5px_white]
                [&_svg]:h-6
                [&_svg]:w-6
                sm:[&_svg]:h-7
                sm:[&_svg]:w-7
              "
            >
              {social.icon}
            </a>
          ))}
        </div>

        <div className="w-full border-t border-white/20 px-2 pt-3 text-[0.75rem] text-[#f0f0f0] sm:text-[0.85rem]">
          <span>{t("footer.copyright", { year: currentYear })}</span>

          <span className="mx-2" aria-hidden="true">
            |
          </span>

          <Link
            href="/terms"
            className="text-[#f0f0f0] no-underline hover:underline"
          >
            {t("footer.terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
