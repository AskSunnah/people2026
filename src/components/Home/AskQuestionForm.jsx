// src/components/Home/AskQuestionForm.jsx
"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { submitQuestion } from "@/services/question.service";

const MAX_QUESTION_LENGTH = 800;

export default function AskQuestionForm({ locale = "en", direction = "ltr" }) {
  const t = useTranslations("home.modal");
  const tAsk = useTranslations("ask");

  const [submitted, setSubmitted] = useState(false);
  const [questionLength, setQuestionLength] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const formRef = useRef(null);

  const isRTL = direction === "rtl";
  const alignClass = isRTL ? "text-right" : "text-left";
  const isNearLimit = questionLength >= MAX_QUESTION_LENGTH * 0.9;
  const isAtLimit = questionLength >= MAX_QUESTION_LENGTH;

  const inputClass = `w-full px-3 py-3 border border-[#ccc] rounded-[6px] text-[var(--text-primary)] text-[14px] disabled:opacity-60 ${alignClass}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const formData = new FormData(formRef.current);
    const name = formData.get("name");
    const email = formData.get("email");
    const question = formData.get("question");

    setSubmitting(true);
    setError(false);
    try {
      await submitQuestion({ name, email, question, language: locale });
      setSubmitted(true);
      setQuestionLength(0);
      formRef.current.reset();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="py-8 text-center"
        dir={direction}
        lang={locale}
        role="status"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--bg-color-header)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[var(--bg-color-header)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-[var(--text-main)]">
          {t("thankYou")}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">
          {t("success")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/categories"
            className="rounded-md bg-[var(--bg-color-header)] px-6 py-3 text-white transition hover:opacity-90"
          >
            {tAsk("browseCategories")}
          </Link>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="rounded-md border border-[var(--bg-color-header)] px-6 py-3 text-[var(--bg-color-header)] transition hover:bg-[#fff6d8]"
          >
            {tAsk("askAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} dir={direction} lang={locale}>
      <input
        type="text"
        name="name"
        placeholder={t("namePlaceholder")}
        required
        disabled={submitting}
        className={`${inputClass} mb-4`}
      />

      <input
        type="email"
        name="email"
        placeholder={t("emailPlaceholder")}
        required
        disabled={submitting}
        className={`${inputClass} mb-4`}
      />

      <p className={`mb-2 text-[12px] text-[#888] ${alignClass}`}>
        {t("questionHint")}
      </p>

      <textarea
        name="question"
        rows="6"
        placeholder={t("questionPlaceholder")}
        required
        maxLength={MAX_QUESTION_LENGTH}
        onChange={(e) => setQuestionLength(e.target.value.length)}
        disabled={submitting}
        className={inputClass}
      />

      <div
        className={`mb-4 mt-1 text-[12px] tabular-nums ${isRTL ? "text-left" : "text-right"} ${
          isAtLimit
            ? "font-semibold text-red-500"
            : isNearLimit
              ? "text-orange-500"
              : "text-[#999]"
        }`}
      >
        {questionLength}/{MAX_QUESTION_LENGTH}
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {t("connectionError")}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded-[6px] bg-[var(--bg-color-header)] px-5 py-3 text-white transition hover:bg-[#a88c1e] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting && (
          <svg
            className="h-4 w-4 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
