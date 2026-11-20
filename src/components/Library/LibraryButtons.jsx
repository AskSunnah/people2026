import { Link } from "@/i18n/navigation";

export default function LibraryButtons({ lang = "en", label, className = "" }) {
  return (
    <Link
      href="/books"
      locale={lang}
      className={`lib-button inline-flex h-[36px] items-center justify-center whitespace-nowrap rounded-[6px] px-4 text-sm font-semibold no-underline transition-all ${className}`}
    >
      {label}
    </Link>
  );
}
