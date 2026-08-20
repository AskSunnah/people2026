// src/components/Contribute/Contribute.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { createCheckoutSession } from "@/services/stripe.service";

const PAYPAL_LINK = "https://www.paypal.me/asksunnah";

function getAmount(customAmount, selectedAmount) {
  const amount = customAmount !== "" ? parseFloat(customAmount) : selectedAmount;
  return Math.max(1, amount);
}

export default function Contribute() {
  const locale = useLocale();
  const t = useTranslations("contribute");
  const isArabic = locale === "ar";

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [donationType, setDonationType] = useState("one-time");
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const amountToSend = getAmount(customAmount, selectedAmount);

  const handlePayPalRedirect = () => {
    window.open(PAYPAL_LINK, "_blank", "noopener,noreferrer");
  };

  const handleStripeDonate = async () => {
    if (!email) {
      alert(t("emailRequired"));
      return;
    }

    setSubmitting(true);
    try {
      const data = await createCheckoutSession({
        email,
        amount: amountToSend,
        isRecurring: donationType === "recurring",
        lang: locale,
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(t("genericError"));
      }
    } catch (err) {
      console.error("Checkout session error:", err);
      alert(t("genericError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="bg-[#f7f7f7] font-[Segoe_UI,sans-serif] min-h-[69vh] px-4 sm:px-8 md:px-[51px] py-[23px] flex justify-center items-center"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden max-w-[1000px] w-full">
        <div className="flex-1 px-5 py-6 sm:px-7 sm:py-8 md:px-[30px] md:py-[40px]">
          <h1 className="text-[22px] sm:text-[25px] md:text-[28px] text-[#2c3e50] mb-[10px] font-bold">
            {t("heading")}
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#555] mb-[25px]">
            {t("motivation")}
          </p>

          <h3 className="text-[16px] md:text-[18px] text-[#2c3e50] mb-[12px] font-bold">
            {t("choosePayment")}
          </h3>

          <div className="flex gap-5 mb-5">
            <button
              type="button"
              onClick={handlePayPalRedirect}
              className="border border-[#ccc] rounded-[8px] bg-white px-[14px] py-[10px] cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
            >
              <Image
                src="/icons/payment/paypal.png"
                alt="PayPal"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod("card")}
              className="border border-[#ccc] rounded-[8px] bg-white px-[14px] py-[10px] cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
            >
              <Image
                src="/icons/payment/card.png"
                alt="Card"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </button>
          </div>
        </div>

        {selectedMethod === "card" && (
          <div className="flex-1 px-5 py-6 sm:px-7 sm:py-8 md:px-[30px] md:py-[40px] bg-[var(--bg-light)] border-t md:border-t-0 md:border-l border-[#eee]">
            <div className="flex justify-center mb-[15px]">
              <div className="inline-flex rounded-[5px] overflow-hidden border border-[var(--bg-color-header)]">
                <button
                  type="button"
                  onClick={() => setDonationType("one-time")}
                  className={`px-4 sm:px-[21px] py-[9px] border-none cursor-pointer text-sm sm:text-base ${
                    donationType === "one-time"
                      ? "bg-[var(--bg-color-header)] text-white"
                      : "bg-white text-[#2c3e50]"
                  }`}
                >
                  {t("oneTime")}
                </button>
                <button
                  type="button"
                  onClick={() => setDonationType("recurring")}
                  className={`px-4 sm:px-[21px] py-[9px] border-none cursor-pointer text-sm sm:text-base ${
                    donationType === "recurring"
                      ? "bg-[var(--bg-color-header)] text-white"
                      : "bg-white text-[#2c3e50]"
                  }`}
                >
                  {t("monthly")}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-[10px] mb-[15px]">
              {[10, 25, 50].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount("");
                  }}
                  className={`px-4 sm:px-[21px] py-[9px] rounded-[5px] border-none cursor-pointer text-sm sm:text-base ${
                    selectedAmount === amt && customAmount === ""
                      ? "bg-[var(--bg-color-header)] text-white"
                      : "bg-[#f1f1f1] text-[#333]"
                  }`}
                >
                  ${amt}
                </button>
              ))}
              <input
                type="number"
                min="1"
                placeholder={t("otherAmount")}
                value={customAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) > 0) {
                    setCustomAmount(val);
                  }
                }}
                className="w-[80px] p-[10px] rounded-[5px] border border-[#ccc] text-sm sm:text-base"
              />
            </div>

            <div className="text-[15px] md:text-[16px] mt-[10px] mb-[10px]">
              {t("donating")} <strong>${amountToSend}</strong>
            </div>

            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-[10px] mb-[10px] rounded-[5px] border border-[#ccc] text-sm sm:text-base"
            />

            <button
              type="button"
              onClick={handleStripeDonate}
              disabled={submitting}
              className="bg-[var(--bg-color-header)] text-white px-6 py-3 border-none rounded-[5px] text-[15px] md:text-[16px] cursor-pointer w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? t("processing") : t("card")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}