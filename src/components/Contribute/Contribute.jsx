// src/components/Contribute/Contribute.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { createCheckoutSession } from "@/services/stripe.service";

const PAYPAL_LINK = "https://www.paypal.me/asksunnah";
const PRESET_AMOUNTS = [10, 25, 50];
const IMPACT_KEYS = ["free", "sources", "languages", "tech"];

// Quran 2:261
const AYAH_AR =
  "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ ۗ وَاللَّهُ يُضَاعِفُ لِمَن يَشَاءُ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bg-color-header)]";

function Icon({ children, className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ICONS = {
  free: (
    <Icon>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </Icon>
  ),
  sources: (
    <Icon>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </Icon>
  ),
  languages: (
    <Icon>
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </Icon>
  ),
  tech: (
    <Icon>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Icon>
  ),
  lock: (
    <Icon className="w-4 h-4 shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
  ),
  card: (
    <Icon className="w-5 h-5 shrink-0">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </Icon>
  ),
  external: (
    <Icon className="w-3.5 h-3.5 shrink-0 opacity-70">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </Icon>
  ),
};

function getAmount(customAmount, selectedAmount) {
  if (customAmount !== "") {
    const parsed = parseFloat(customAmount);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return Math.max(1, Math.round(parsed * 100) / 100);
    }
  }
  return Math.max(1, Number(selectedAmount) || 25);
}

function Section({ className = "", children }) {
  return (
    <section
      className={`py-9 sm:py-11 md:py-14 border-t border-[#eceef0] first:border-t-0 first:pt-0 ${className}`}
    >
      {children}
    </section>
  );
}

function Quote({ arabic, text, reference, label }) {
  return (
    <div className="rounded-[20px] sm:rounded-[24px] bg-[#fafafa] border border-[#eceef0] px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
      {label && (
        <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--bg-color-header)] mb-3">
          {label}
        </p>
      )}
      {arabic && (
        <p
          lang="ar"
          dir="rtl"
          className="font-arabic text-[24px] sm:text-[32px] md:text-[38px] leading-[2.05] sm:leading-[2.15] text-[var(--bg-color-header)] mb-4 sm:mb-5 text-center break-words"
        >
          {arabic}
        </p>
      )}
      <blockquote
        className={`mb-3.5 sm:mb-4 break-words ${
          arabic
            ? "text-[14px] sm:text-[16px] md:text-[17px] leading-[1.75] text-[#3b4650] text-center max-w-[620px] mx-auto"
            : "text-[16px] sm:text-[18px] md:text-[21px] leading-[1.65] font-medium text-[#1f2d3a]"
        }`}
      >
        {text}
      </blockquote>
      <p
        className={`text-[12px] sm:text-[13px] font-semibold text-[#6b747c] ${
          arabic ? "text-center" : ""
        }`}
      >
        {reference}
      </p>
    </div>
  );
}

export default function Contribute() {
  const locale = useLocale();
  const t = useTranslations("contribute");
  const isArabic = locale === "ar";

  const [donationType, setDonationType] = useState("one-time");
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cardInView, setCardInView] = useState(false);

  const mobileCardRef = useRef(null);
  const desktopEmailRef = useRef(null);
  const mobileEmailRef = useRef(null);

  const amountToSend = getAmount(customAmount, selectedAmount);
  const isRecurring = donationType === "recurring";
  const contributeLabel = t.has("give.title") ? t("give.title") : "Contribute";
  const floatingLeftText = t.has("floatingText")
    ? t("floatingText")
    : "Support open knowledge";

  useEffect(() => {
    const el = mobileCardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setCardInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollToMobileForm = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    mobileCardRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(
      () => mobileEmailRef.current?.focus({ preventScroll: true }),
      reduce ? 0 : 450
    );
  };

  const handlePayPalRedirect = () => {
    window.open(PAYPAL_LINK, "_blank", "noopener,noreferrer");
  };

  const handleStripeDonate = async (e, isMobile = false) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMsg(t("emailRequired"));
      const targetRef = isMobile ? mobileEmailRef.current : desktopEmailRef.current;
      targetRef?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const data = await createCheckoutSession({
        email: trimmedEmail,
        amount: amountToSend,
        isRecurring,
        lang: locale,
      });
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg(t("genericError"));
      }
    } catch (err) {
      console.error("Checkout session error:", err);
      setErrorMsg(t("genericError"));
    } finally {
      setSubmitting(false);
    }
  };

  const renderCheckoutCard = (isMobile = false) => (
    <form
      ref={isMobile ? mobileCardRef : undefined}
      onSubmit={(e) => handleStripeDonate(e, isMobile)}
      noValidate
      className="w-full min-w-0 rounded-[20px] sm:rounded-[24px] border border-[#e6e6e6] bg-[#fafafa] p-4 sm:p-6 md:p-7 scroll-mt-6"
    >
      <div className="mb-4 sm:mb-5">
        <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--bg-color-header)] mb-1">
          {contributeLabel}
        </p>
        <p className="text-[13px] sm:text-[14px] text-[#5b6670]">
          {t("choosePayment")}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label={`${t("oneTime")} / ${t("monthly")}`}
        className="grid grid-cols-2 p-1 mb-4 rounded-[12px] bg-[#eceef0]"
      >
        {[
          { id: "one-time", label: t("oneTime") },
          { id: "recurring", label: t("monthly") },
        ].map(({ id, label }) => {
          const active = donationType === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setDonationType(id)}
              className={`min-h-[42px] py-2 px-2 rounded-[9px] text-[13px] sm:text-[14px] font-semibold transition-all truncate ${focusRing} ${
                active
                  ? "bg-white text-[var(--bg-color-header)] shadow-xs"
                  : "text-[#5b6670] hover:text-[#1f2d3a]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {PRESET_AMOUNTS.map((amt) => {
          const active = selectedAmount === amt && customAmount === "";
          return (
            <button
              key={amt}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setSelectedAmount(amt);
                setCustomAmount("");
              }}
              className={`min-h-[44px] py-2.5 px-2 rounded-[12px] border text-[14px] sm:text-[15px] font-semibold transition-colors ${focusRing} ${
                active
                  ? "bg-[var(--bg-color-header)] border-[var(--bg-color-header)] text-white"
                  : "bg-white border-[#d9dcdf] text-[#1f2d3a] hover:border-[var(--bg-color-header)]"
              }`}
            >
              ${amt}
            </button>
          );
        })}
        <div className="relative min-w-0">
          <span
            className="absolute inset-y-0 start-3 flex items-center text-[#8a939b] text-[14px] sm:text-[15px] pointer-events-none"
            aria-hidden="true"
          >
            $
          </span>
          <input
            type="number"
            min="1"
            step="any"
            inputMode="decimal"
            aria-label={t("otherAmount")}
            placeholder={t("otherAmount")}
            value={customAmount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || parseFloat(val) >= 0) {
                setCustomAmount(val);
              }
            }}
            className={`w-full min-h-[44px] h-full ps-7 pe-2 py-2.5 rounded-[12px] border text-[14px] sm:text-[15px] bg-white placeholder:text-[#8a939b] min-w-0 ${focusRing} ${
              customAmount !== ""
                ? "border-[var(--bg-color-header)]"
                : "border-[#d9dcdf]"
            }`}
          />
        </div>
      </div>

      <p className="min-h-[18px] text-[12px] text-[#5b6670] mb-3.5 sm:mb-4">
        {isRecurring ? t("recurringNote") : ""}
      </p>

      <input
        ref={isMobile ? mobileEmailRef : desktopEmailRef}
        type="email"
        autoComplete="email"
        aria-label={t("emailPlaceholder")}
        aria-invalid={Boolean(errorMsg)}
        placeholder={t("emailPlaceholder")}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errorMsg) setErrorMsg("");
        }}
        className={`w-full min-h-[44px] px-3.5 sm:px-4 py-3 rounded-[12px] border bg-white text-[15px] placeholder:text-[#8a939b] min-w-0 ${focusRing} ${
          errorMsg ? "border-red-600 mb-2" : "border-[#d9dcdf] mb-3.5 sm:mb-4"
        }`}
      />

      {errorMsg && (
        <p role="alert" className="text-[12px] font-medium text-red-700 mb-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`w-full min-h-[46px] flex items-center justify-center gap-2 px-4 sm:px-5 py-3.5 rounded-[12px] bg-[var(--bg-color-header)] text-white text-[14px] sm:text-[15px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed ${focusRing}`}
      >
        {ICONS.card}
        <span className="truncate">
          {submitting
            ? t("processing")
            : `${t("card")} · $${amountToSend}${
                isRecurring ? ` / ${t("monthly")}` : ""
              }`}
        </span>
      </button>

      <div className="h-px bg-[#e6e6e6] my-4" />

      <button
        type="button"
        onClick={handlePayPalRedirect}
        className={`w-full min-h-[44px] flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3 rounded-[12px] border border-[#d9dcdf] bg-white text-[#1f2d3a] text-[14px] sm:text-[15px] font-semibold transition-colors hover:border-[var(--bg-color-header)] ${focusRing}`}
      >
        <Image
          src="/icons/payment/paypal.png"
          alt=""
          width={22}
          height={22}
          className="w-5 h-5 object-contain shrink-0"
        />
        <span>PayPal</span>
        {ICONS.external}
      </button>

      <p className="flex items-center justify-center gap-2 mt-4 text-[12px] text-[#6b747c] text-center">
        {ICONS.lock}
        <span>{t("secureNote")}</span>
      </p>
    </form>
  );

  const showMobileSticky = !cardInView;

  return (
    <div
      className={`overflow-x-clip bg-white px-4 sm:px-8 md:px-[51px] pt-8 sm:pt-10 lg:py-20 ${
        showMobileSticky ? "pb-24 lg:pb-20" : "pb-14 lg:pb-20"
      } ${isArabic ? "font-arabic" : "font-[Segoe_UI,sans-serif]"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_400px] gap-8 sm:gap-10 lg:gap-14 items-start">
        {/* Left editorial column */}
        <main className="min-w-0">
          <Section>
            <h1 className="text-[28px] sm:text-[34px] md:text-[46px] leading-[1.15] tracking-[-0.02em] font-bold text-[#1f2d3a] mb-3.5 sm:mb-4 break-words">
              {t("hero.title")}
            </h1>
            <p className="text-[15px] sm:text-[16px] md:text-[18px] leading-[1.7] text-[#5b6670] max-w-[620px]">
              {t("motivation")}
            </p>
            <div className="mt-5 lg:hidden">
              <button
                type="button"
                onClick={scrollToMobileForm}
                className={`min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-[var(--bg-color-header)] text-white text-[14px] font-semibold transition-opacity hover:opacity-90 ${focusRing}`}
              >
                {ICONS.card}
                <span>{contributeLabel}</span>
              </button>
            </div>
          </Section>

          <Section>
            <Quote
              arabic={AYAH_AR}
              text={t("ayah.translation")}
              reference={t("ayah.reference")}
            />
          </Section>

          <Section>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-[22px] sm:text-[24px] md:text-[30px] leading-tight font-bold text-[#1f2d3a] mb-2">
                {t("impact.heading")}
              </h2>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed text-[#5b6670] max-w-[580px]">
                {t("impact.subheading")}
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {IMPACT_KEYS.map((key) => (
                <li
                  key={key}
                  className="min-w-0 rounded-[18px] sm:rounded-[20px] border border-[#eceef0] bg-white p-5 sm:p-6"
                >
                  <div className="w-11 h-11 mb-3.5 sm:mb-4 rounded-2xl flex items-center justify-center text-[var(--bg-color-header)] bg-[color-mix(in_srgb,var(--bg-color-header)_12%,white)]">
                    {ICONS[key]}
                  </div>
                  <h3 className="text-[16px] sm:text-[17px] font-bold text-[#1f2d3a] mb-1.5">
                    {t(`impact.items.${key}.title`)}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#5b6670]">
                    {t(`impact.items.${key}.text`)}
                  </p>
                </li>
              ))}
            </ul>
          </Section>

          <Section>
            <Quote
              label={t("jariyah.heading")}
              text={t("jariyah.hadith")}
              reference={t("jariyah.reference")}
            />
          </Section>

          {/* Mobile-only checkout card */}
          <div className="lg:hidden pt-2 sm:pt-4 min-w-0">
            {renderCheckoutCard(true)}
          </div>
        </main>

        {/* Right column: single sticky checkout card on desktop */}
        <aside
          aria-label={contributeLabel}
          className="hidden lg:block lg:sticky lg:top-24 min-w-0"
        >
          {renderCheckoutCard(false)}
        </aside>
      </div>

      {/* Mobile-only floating bar when the mobile card is off-screen */}
      <div
        className={`lg:hidden fixed z-40 bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 transition-all duration-300 ${
          showMobileSticky
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-[16px] sm:rounded-[18px] bg-white border border-[#e6e6e6] shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
          <span className="text-[13px] sm:text-[14px] font-semibold text-[#1f2d3a] truncate">
            {floatingLeftText}
          </span>
          <button
            type="button"
            onClick={scrollToMobileForm}
            className={`min-h-[42px] shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[var(--bg-color-header)] text-white text-[13px] sm:text-[14px] font-semibold ${focusRing}`}
          >
            {ICONS.card}
            <span>{contributeLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}