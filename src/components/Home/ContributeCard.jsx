// src/components/Home/ContributeCard.jsx
import Link from "next/link";

export default function ContributeCard({ locale, className = "" }) {
  const isArabic = locale === "ar";
  return (
    <section
      aria-labelledby="contribute-heading"
      className={`rounded-xl border border-[#e9dfbd] bg-white p-5 ${className}`}
    >
      <h2
        id="contribute-heading"
        className="mb-1 text-base font-bold text-[var(--bg-color-header)]"
      >
        {isArabic ? "ادعم المشروع" : "Support the project"}
      </h2>
      <p className="text-sm leading-6 text-gray-600">
        {isArabic
          ? "أسأل السنة مجاني للجميع. يمكنك دعم المشروع مالياً ليبقى متاحاً ويستمر في النمو."
          : "Ask Sunnah is free for everyone. Your support helps keep it online and growing."}
      </p>
      <Link
        href={`/${locale}/contribute`}
        className="mt-3 inline-block text-sm font-semibold text-[#a88700] hover:underline"
      >
        {isArabic ? "ادعم الآن" : "Support us"}
      </Link>
    </section>
  );
}
