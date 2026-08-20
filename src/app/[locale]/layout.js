// src/app/[locale]/layout.js
import { hasLocale, NextIntlClientProvider } from "next-intl";

import { getMessages, setRequestLocale } from "next-intl/server";

import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";

import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
