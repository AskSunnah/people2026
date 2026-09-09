"use client";

// src/components/common/ReportableContent.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Flag, X, Check } from "lucide-react";
import { submitReport } from "@/services/report.service";

const QUESTION_REASON_KEYS = [
  "academic_content",
  "spelling_grammar",
  "translation_error",
  "broken_reference",
  "contradiction",
  "unclear",
  "inappropriate",
  "other",
];

const BOOK_REASON_KEYS = [
  "spelling_grammar",
  "translation_error",
  "wrong_reference",
  "text_corruption",
  "formatting_issue",
  "inappropriate",
  "other",
];

const LABELS = {
  en: {
    startButton: "Report an issue",
    title: "What's the issue?",
    selectedTextLabel: "Reported text",
    reasonLabel: "Reason",
    notePlaceholder: "Add details (optional)",
    emailPlaceholder: "Your email",
    emailLabel: "Email",
    submit: "Send report",
    cancel: "Cancel",
    success: "Report received — our team will review it.",
    error: "Couldn't send. Please try again.",
    selectReason: "Please choose a reason.",
    tapToSelect: "Write or paste the text here",
    questionReasons: {
      academic_content: "Academic content issue",
      spelling_grammar: "Spelling / grammar",
      translation_error: "Translation error",
      broken_reference: "Broken or wrong reference",
      contradiction: "Contradicts another answer",
      unclear: "Unclear or confusing",
      inappropriate: "Inappropriate content",
      other: "Other",
    },
    bookReasons: {
      spelling_grammar: "Spelling / grammar",
      translation_error: "Translation error",
      wrong_reference: "Wrong or missing reference",
      text_corruption: "Corrupted or garbled text",
      formatting_issue: "Formatting / layout issue",
      inappropriate: "Inappropriate content",
      other: "Other",
    },
  },
  ar: {
    startButton: "الإبلاغ عن مشكلة",
    title: "ما هي المشكلة؟",
    selectedTextLabel: "النص المُبلَّغ عنه",
    reasonLabel: "السبب",
    notePlaceholder: "أضف تفاصيل (اختياري)",
    emailPlaceholder: "بريدك الإلكتروني",
    emailLabel: "البريد الإلكتروني",
    submit: "إرسال البلاغ",
    cancel: "إلغاء",
    success: "تم استلام البلاغ — سيراجعه فريقنا.",
    error: "تعذر الإرسال. حاول مرة أخرى.",
    selectReason: "يرجى اختيار سبب.",
    tapToSelect: "اكتب أو الصق النص هنا",
    questionReasons: {
      academic_content: "مشكلة في المحتوى العلمي",
      spelling_grammar: "إملاء / نحو",
      translation_error: "خطأ في الترجمة",
      broken_reference: "مرجع خاطئ أو مكسور",
      contradiction: "يتعارض مع إجابة أخرى",
      unclear: "غير واضح أو مُربك",
      inappropriate: "محتوى غير مناسب",
      other: "أخرى",
    },
    bookReasons: {
      spelling_grammar: "إملاء / نحو",
      translation_error: "خطأ في الترجمة",
      wrong_reference: "مرجع خاطئ أو ناقص",
      text_corruption: "نص تالف أو غير مقروء",
      formatting_issue: "مشكلة في التنسيق",
      inappropriate: "محتوى غير مناسب",
      other: "أخرى",
    },
  },
};

// ─── shared modal UI ──────────────────────────────────────────────────────────
function ReportModalUI({
  open,
  onClose,
  t,
  isRTL,
  reasonKeys,
  reasonLabels,
  submitPayload,
}) {
  const [selectedText, setSelectedText] = useState("");
  const [selectedReason, setSelectedReason] = useState(null);
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);

  const reset = () => {
    setSelectedText("");
    setSelectedReason(null);
    setNote("");
    setEmail("");
    setStatus("idle");
    setErrorMsg("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedText.trim() && !note.trim()) {
      setErrorMsg(
        isRTL ? "يرجى وصف المشكلة." : "Please enter the reported text.",
      );
      return;
    }
    if (!selectedReason) {
      setErrorMsg(t.selectReason);
      return;
    }
    if (!email.trim()) {
      setErrorMsg(
        isRTL ? "يرجى إدخال بريدك الإلكتروني." : "Please enter your email.",
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setErrorMsg(
        isRTL
          ? "يرجى إدخال بريد إلكتروني صحيح."
          : "Please enter a valid email address.",
      );
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    const reasonLabel = reasonLabels[selectedReason];
    const fullReason = note.trim()
      ? `${reasonLabel}: ${note.trim()}`
      : reasonLabel;
    try {
      await submitReport({
        ...submitPayload,
        reportedText: selectedText.trim(),
        reason: fullReason,
        email: email.trim() || undefined,
      });
      setStatus("success");
      setTimeout(handleClose, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || t.error);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[99999] bg-black/45 flex items-center justify-center p-4"
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-[14px] shadow-2xl overflow-hidden flex flex-col w-full max-w-[440px] max-h-[85vh] ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0] shrink-0">
          <div className="flex items-center gap-2">
            <Flag size={14} className="text-[#c3a421]" />
            <span className="font-semibold text-[0.95rem] text-[#333]">
              {t.title}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="bg-transparent border-none cursor-pointer text-[#aaa] hover:text-[#666]"
          >
            <X size={16} />
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-10 text-center flex-1">
            <div 
  className="w-12 h-12 rounded-full flex items-center justify-center" 
  style={{ background: "linear-gradient(135deg, #fff1b7, #bea331)" }}
>
  <Check size={22} className="text-white" />
</div>
<p 
  className="font-semibold text-[0.95rem] m-0" 
  style={{
    background: " #8a782e",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  }}
>
  {t.success}
</p>


          </div>
        ) : (
          <>
            {/* Scrollable Content */}
            <div
              className="px-5 py-4 space-y-4 overflow-y-auto flex-1"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div>
                <label className="text-[0.7rem] font-bold text-[#5c4712] uppercase tracking-wide block mb-1.5">
                  {t.selectedTextLabel}{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <textarea
                  value={selectedText}
                  onChange={(e) => setSelectedText(e.target.value)}
                  placeholder={t.tapToSelect}
                  rows={3}
                  className={`w-full px-3 py-2.5 border rounded-[8px] text-[0.85rem] text-[#333] resize-none focus:outline-none leading-relaxed bg-white border-[#ddd] focus:border-[#c3a421] ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                  required={true}
                />
              </div>

              <div className="relative">
                <label className="text-[0.7rem] font-bold text-[#5c4712] uppercase tracking-wide block mb-1.5">
                  {t.reasonLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <button
                  type="button"
                  onClick={() => setReasonOpen(!reasonOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 border border-[#ddd] rounded-[8px] bg-white text-[0.83rem] cursor-pointer ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={selectedReason ? "text-[#333]" : "text-[#999]"}
                  >
                    {selectedReason
                      ? reasonLabels[selectedReason]
                      : t.selectReason}
                  </span>

                  <span className="text-[#999]">{reasonOpen ? "▲" : "▼"}</span>
                </button>

                {reasonOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-[#ddd] rounded-[8px] shadow-lg overflow-hidden">
                    {reasonKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedReason(key);
                          setReasonOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-[0.83rem] hover:bg-[#f8f5e8] cursor-pointer ${
                          isRTL ? "text-right" : "text-left"
                        } ${
                          selectedReason === key
                            ? "bg-[#f8f5e8] text-[#5c4712] font-semibold"
                            : "text-[#555]"
                        }`}
                      >
                        {reasonLabels[key]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.notePlaceholder}
                rows={2}
                className={`w-full px-3 py-2 border border-[#ddd] rounded-[8px] text-[0.83rem] text-[#333] resize-none focus:outline-none focus:border-[#c3a421] ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />

              <div>
                <label className="text-[0.7rem] font-bold text-[#5c4712] uppercase tracking-wide block mb-1.5">
                  {t.emailLabel}
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-3 py-2 border border-[#ddd] rounded-[8px] text-[0.83rem] text-[#333] focus:outline-none focus:border-[#c3a421] bg-white"
                  dir={isRTL ? "rtl" : "ltr"}
                  required
                />
              </div>

              {errorMsg && (
                <p className="text-[#cc3333] text-[0.78rem] m-0">{errorMsg}</p>
              )}
            </div>

            {/* Fixed Footer */}
            <div
              className={`flex gap-2 p-4 border-t border-[#f0f0f0] bg-white shrink-0 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 text-[0.85rem] px-4 py-2.5 rounded-[8px] border border-[#ddd] bg-white text-[#666] hover:bg-[#f5f5f5] transition cursor-pointer"
              >
                {t.cancel}
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "submitting"}
                className="flex-1 text-[0.85rem] px-4 py-2.5 rounded-[8px] bg-[var(--bg-color-header)] text-white hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
              >
                {status === "submitting" ? "…" : t.submit}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}

// ─── For QuestionPage / Fatwa — wraps content, shows a trigger button ─────────
export function ReportableContent({
  lang = "en",
  contentType,
  slug,
  bookId,
  chapterNumber,
  pageNumber,
  bottomOffset = "5.5rem",
  className = "",
  children,
}) {
  const t = LABELS[lang] || LABELS.en;
  const isRTL = lang === "ar";
  const isBook = contentType === "book_page";
  const reasonKeys = isBook ? BOOK_REASON_KEYS : QUESTION_REASON_KEYS;
  const reasonLabels = isBook ? t.bookReasons : t.questionReasons;

  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      <div className={`relative ${className}`}>
        {children}

        {/* Report button */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="mt-8 mb-4 flex justify-center"
        >
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 text-[0.82rem] font-medium text-[#5c4712] bg-[#fffaf0] border border-[#e6cf7a] rounded-full px-4 py-2 cursor-pointer hover:bg-[#fff3c4] transition-colors"
          >
            <Flag size={13} />
            {t.startButton}
          </button>
        </div>
      </div>

      <ReportModalUI
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        t={t}
        isRTL={isRTL}
        reasonKeys={reasonKeys}
        reasonLabels={reasonLabels}
        submitPayload={{
          contentType,
          lang,
          slug,
          bookId,
          chapterNumber,
          pageNumber,
        }}
      />
    </>
  );
}

// ─── For ReadBook — controlled externally, no trigger button ─────────────────
export function ReportModal({
  open,
  onClose,
  lang = "en",
  contentType,
  slug,
  bookId,
  chapterNumber,
  pageNumber,
}) {
  const t = LABELS[lang] || LABELS.en;
  const isRTL = lang === "ar";
  const isBook = contentType === "book_page";
  const reasonKeys = isBook ? BOOK_REASON_KEYS : QUESTION_REASON_KEYS;
  const reasonLabels = isBook ? t.bookReasons : t.questionReasons;

  return (
    <ReportModalUI
      open={open}
      onClose={onClose}
      t={t}
      isRTL={isRTL}
      reasonKeys={reasonKeys}
      reasonLabels={reasonLabels}
      submitPayload={{
        contentType,
        lang,
        slug,
        bookId,
        chapterNumber,
        pageNumber,
      }}
    />
  );
}
