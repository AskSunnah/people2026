// // src/app/[locale]/layout.js
// import { hasLocale, NextIntlClientProvider } from "next-intl";

// import { getMessages, setRequestLocale } from "next-intl/server";

// import { notFound } from "next/navigation";

// import { routing } from "@/i18n/routing";

// import "../globals.css";

// export function generateStaticParams() {
//   return routing.locales.map((locale) => ({
//     locale,
//   }));
// }

// export default async function LocaleLayout({ children, params }) {
//   const { locale } = await params;

//   if (!hasLocale(routing.locales, locale)) {
//     notFound();
//   }

//   setRequestLocale(locale);

//   const messages = await getMessages();

//   return (
//     <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
//       <body className="min-h-screen">
//         <NextIntlClientProvider messages={messages}>
//           <div className="flex min-h-screen flex-col">{children}</div>
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }



// src/app/[locale]/layout.js
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import "../globals.css";


export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common.site" });

  const { title, ...rest } = buildMetadata({
    locale,
    path: "/",
    title: t("name"),
    description: t("tagline"),
  });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("name"),
      template: `%s | ${t("name")}`,
    },
    ...rest, // description, alternates, openGraph, twitter — no title in here
  };
}

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

