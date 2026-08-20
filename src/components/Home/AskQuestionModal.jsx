"use client";

import { useEffect, useRef, useState } from "react";
import { submitQuestion } from "@/services/question.service";

const MAX_QUESTION_LENGTH = 800;

const AskQuestionModal = ({ isOpen = false, onClose = () => {}, language = "en", direction = "ltr", t }) => {
  const [submitted, setSubmitted] = useState(false);
  const [questionLength, setQuestionLength] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setQuestionLength(0);
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const formData = new FormData(formRef.current);
    const name = formData.get("name");
    const email = formData.get("email");
    const question = formData.get("question");

    setSubmitting(true);
    try {
      await submitQuestion({ name, email, question, language });
      setSubmitted(true);
      setQuestionLength(0);
      formRef.current.reset();
    } catch (err) {
      alert(t("connectionError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isRTL = direction === "rtl";
  const isNearLimit = questionLength >= MAX_QUESTION_LENGTH * 0.9;
  const isAtLimit = questionLength >= MAX_QUESTION_LENGTH;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center overflow-hidden"
      onClick={onClose}
    >
      <div
        className={`
          bg-[var(--bg-main)] p-8 w-[90%] max-w-[500px] rounded-[10px]
          shadow-[0_6px_15px_rgba(0,0,0,0.3)]
          ${isRTL ? "text-right" : "text-left"}
        `}
        dir={direction}
        lang={language}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <span
            className="text-[#aaa] text-2xl font-bold cursor-pointer"
            onClick={onClose}
            role="button"
            aria-label={t("close")}
          >
            &times;
          </span>
        </div>

        <h3 className="mb-4 text-[var(--text-accent)] text-[17px] font-bold">{t("title")}</h3>

        {!submitted ? (
          <form ref={formRef} onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder={t("namePlaceholder")}
              required
              disabled={submitting}
              className={`w-full px-3 py-3 mb-4 border border-[#ccc] rounded-[6px] text-[var(--text-primary)] text-[14px] disabled:opacity-60 ${isRTL ? "text-right" : "text-left"}`}
            />

            <input
              type="email"
              name="email"
              placeholder={t("emailPlaceholder")}
              required
              disabled={submitting}
              className={`w-full px-3 py-3 mb-4 border border-[#ccc] rounded-[6px] text-[var(--text-primary)] text-[14px] disabled:opacity-60 ${isRTL ? "text-right" : "text-left"}`}
            />

            <p className={`text-[12px] mb-2 text-[#888] ${isRTL ? "text-right" : "text-left"}`}>
              {t("questionHint")}
            </p>

            <textarea
              name="question"
              rows="5"
              placeholder={t("questionPlaceholder")}
              required
              maxLength={MAX_QUESTION_LENGTH}
              onChange={(e) => setQuestionLength(e.target.value.length)}
              disabled={submitting}
              className={`w-full px-3 py-3 border border-[#ccc] rounded-[6px] text-[var(--text-primary)] text-[14px] disabled:opacity-60 ${isRTL ? "text-right" : "text-left"}`}
            />

            <div
              className={`text-[12px] mb-4 mt-1 ${isRTL ? "text-left" : "text-right"} ${
                isAtLimit ? "text-red-500 font-semibold" : isNearLimit ? "text-orange-500" : "text-[#999]"
              }`}
            >
              {questionLength}/{MAX_QUESTION_LENGTH}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="relative px-5 py-3 bg-[var(--bg-color-header)] text-white rounded-[6px] hover:bg-[#a88c1e] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {submitting ? t("submitting") : t("submit")}
            </button>
          </form>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--bg-color-header)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--bg-color-header)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-[var(--text-main)]">{t("thankYou")}</h3>
            <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">{t("success")}</p>

            <button
              onClick={onClose}
              className="mt-8 rounded-md bg-[var(--bg-color-header)] px-6 py-3 text-white transition hover:opacity-90"
            >
              {t("close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AskQuestionModal;
