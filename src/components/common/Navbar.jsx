// src/components/common/Navbar.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const LOCALE_INDEPENDENT_PATHS = ["/", "/library", "/about", "/feedback", "/contribute", "/terms"];
const LOCALE_SPECIFIC_PREFIXES = ["/questions/"];

function getLanguageSwitchHref(pathname) {
  if (LOCALE_INDEPENDENT_PATHS.includes(pathname)) return pathname;
  if (LOCALE_SPECIFIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return "/";
  // Unknown route shape — safest default is home rather than guessing.
  return "/";
}

export default function Navbar() {
  const t = useTranslations("common.navigation");
  const locale = useLocale();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const lastScrollY = useRef(0);

  const isArabic = locale === "ar";
  const dir = isArabic ? "rtl" : "ltr";
  const otherLocale = isArabic ? "en" : "ar";
  const switchHref = getLanguageSwitchHref(pathname);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/library", label: t("library") },
    { href: "/about", label: t("about") },
    { href: "/feedback", label: t("feedback") },
    { href: "/contribute", label: t("contribute") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastScrollY.current;
      const pastThreshold = currentY > 80;

      setHidden(goingDown && pastThreshold);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile navbar after navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const linkClass = `
    text-[var(--text-main)] no-underline font-medium
    px-4 py-2 rounded-[4px] inline-block
    transition-all duration-200
    hover:[color:white]
    hover:[background:var(--button-hover)]
  `;

  return (
    <nav
      aria-label={t("mainLabel")}
      dir={dir}
      className={`
        relative
        bg-white sticky top-0 z-[1000]
        py-6 px-4 md:py-4 md:px-0
        shadow-[0_2px_6px_rgba(0,0,0,0.05)]
        border-b border-[#f0f0f0]
        font-[var(--font-family)]
        text-[var(--text-main)]
        transition-transform duration-300 ease-in-out
        ${hidden ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <button
        type="button"
        aria-label={t("toggleLabel")}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="
          text-[1.3rem] bg-transparent border-none cursor-pointer
          text-[var(--text-main)] absolute top-2 right-4 z-[1100]
          md:hidden
        "
      >
        ☰
      </button>

      <div className={`w-full ${isOpen ? "block" : "hidden"} md:block`}>
        <ul
          className="
            list-none m-0 p-0
            flex flex-col items-center gap-4
            md:flex-row md:flex-wrap md:justify-center md:gap-6
          "
          style={{
            direction: dir,
            textAlign: dir === "rtl" ? "right" : "left",
          }}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}

          <li>
            <Link href={switchHref} locale={otherLocale} className={linkClass}>
              {t("switchLanguage")}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
