// src/components/Contribute/DonationStatusCard.jsx
import { Link } from "@/i18n/navigation";

export default function DonationStatusCard({ variant, title, message, linkLabel }) {
  const isSuccess = variant === "success";

  return (
    <div
      className="
        font-[var(--font-family)]
        bg-[var(--page-background)]
        min-h-[60vh]
        flex justify-center items-center
        p-5
      "
    >
      <div
        className="
          bg-white
          p-[40px_30px]
          rounded-[10px]
          text-center
          shadow-[0_4px_12px_rgba(0,0,0,0.1)]
          max-w-[450px]
          w-full
        "
      >
        {/* Circular badge */}
        <div
          className={`
            mx-auto mb-6
            w-20 h-20
            rounded-full
            flex items-center justify-center
            ${
              isSuccess
                ? "bg-gradient-to-br from-[#e1cb57] via-[#c3a421] to-[#a67f0f]"
                : "bg-[#f4f4f4] border-2 border-[#c3a421]/30"
            }
          `}
        >
          {isSuccess ? (
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--bg-color-header)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          )}
        </div>

        <h1 className="text-[28px] text-[#2c3e50] mb-[10px] font-bold">{title}</h1>

        <p className="text-[16px] text-[#555] mb-[25px]">{message}</p>

        <Link
          href="/contribute"
          className="inline-block mt-[10px] text-[var(--bg-color-header)] font-bold no-underline hover:underline"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}