// src/components/Contribute/DonationStatusCard.jsx
import { Link } from "@/i18n/navigation";

export default function DonationStatusCard({ icon, iconColorClass, title, message, linkLabel }) {
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
        <div className={`text-[60px] mb-[20px] ${iconColorClass}`}>{icon}</div>

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