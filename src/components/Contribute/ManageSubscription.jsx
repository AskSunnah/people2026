// src/components/Contribute/ManageSubscription.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getCheckoutSession, createPortalSession } from "@/services/stripe.service";

export default function ManageSubscription() {
  const searchParams = useSearchParams();
  const t = useTranslations("contribute.manage");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    getCheckoutSession(sessionId)
      .then((data) => {
        if (data.customerId) setCustomerId(data.customerId);
      })
      .catch((err) => {
        console.error("Error fetching customer ID:", err);
        setError(true);
      });
  }, [searchParams]);

  const handleManage = async () => {
    setLoading(true);
    try {
      const portal = await createPortalSession(customerId);
      if (portal.url) {
        window.location.href = portal.url;
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error creating portal session:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[450px] mx-auto my-16 px-5 text-center">
      <h1 className="text-[28px] text-[#2c3e50] mb-[10px] font-bold">{t("title")}</h1>

      {error && <p className="text-sm text-red-500 mb-4">{t("error")}</p>}

      <button
        type="button"
        onClick={handleManage}
        disabled={!customerId || loading}
        className="bg-[var(--bg-color-header)] text-white px-6 py-3 border-none rounded-[5px] text-[15px] md:text-[16px] cursor-pointer w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? t("loading") : t("button")}
      </button>
    </div>
  );
}