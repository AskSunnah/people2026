// src/app/not-found.js

import "./globals.css";
import Link from "next/link";
import { SearchX } from "lucide-react";

export default function RootNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-[640px] w-full mx-auto">
        <div
          className="
            rounded-3xl border border-[#c3a421]/20
            bg-gradient-to-br from-[#fffdf7] via-white to-[#fff8dc]
            shadow-sm px-6 py-14 sm:px-10 sm:py-16 text-center
          "
        >
          <div
            className="
              mx-auto mb-6 w-16 h-16 rounded-2xl
              bg-[#c3a421] flex items-center justify-center shadow-sm
            "
          >
            <SearchX size={28} className="text-white" />
          </div>

          <p
            className="
              text-[4rem] sm:text-[5rem] font-black leading-none mb-3
              bg-gradient-to-br from-[#e1cb57] via-[#c3a421] to-[#a67f0f]
              bg-clip-text text-transparent
            "
          >
            404
          </p>

          <p className="text-[1.3rem] font-bold text-[var(--bg-color-header)] mb-2">
            Page not found · الصفحة غير موجودة
          </p>

          <p className="text-[0.95rem] text-gray-500 mb-9 max-w-[420px] mx-auto leading-relaxed">
            The page you're looking for doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/en"
              className="
                inline-block w-full sm:w-auto px-6 py-3 rounded-md
                font-semibold no-underline
                text-[#3d3300]
                bg-gradient-to-br from-[#fff1b7] to-[#bea331]
                hover:from-[#fce490] hover:to-[#a88c1e]
                transition-all duration-300
              "
            >
              Go Home (EN)
            </Link>

            <Link
              href="/ar"
              className="
                inline-block w-full sm:w-auto px-6 py-3 rounded-md
                font-semibold no-underline
                text-[var(--bg-color-header)]
                bg-white border border-[#c3a421]/30
                hover:bg-[#fff8dc]
                transition-all duration-300
              "
            >
              الصفحة الرئيسية (AR)
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

