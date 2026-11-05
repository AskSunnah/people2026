// src/components/Home/AskCard.jsx
// "Can't find your answer?" prompt for category pages.
import Link from "next/link";

export default function AskCard({ locale, topic, href, className = "" }) {
  const isArabic = locale === "ar";
  return (
    <section
      aria-labelledby="ask-card-heading"
      className={`rounded-xl border border-[#e9dfbd] bg-[#fffaf0] p-5 ${className}`}
    >
      <h2
        id="ask-card-heading"
        className="mb-1 text-base font-bold text-[var(--bg-color-header)]"
      >
        {isArabic ? "لم تجد إجابتك؟" : "Can't find your answer?"}
      </h2>
      <p className="text-sm leading-6 text-gray-600">
        {isArabic
          ? `أرسل سؤالك عن ${topic || "دينك"} وسيجيب عنه عالم.`
          : `Send your question${topic ? ` about ${topic}` : ""} and a scholar will answer it from the Qur'an and Sunnah.`}
      </p>
      <Link
        href={href || `/${locale}`}
        className="mt-3 inline-block rounded-lg bg-gradient-to-b from-[#f6e7a0] to-[#c8aa35] px-4 py-2 text-sm font-semibold text-[#3d3000] hover:brightness-95"
      >
        {isArabic ? "اطرح سؤالك" : "Submit your question"}
      </Link>
    </section>
  );
}
