import { setRequestLocale } from "next-intl/server";

export default async function HomePage({ params }) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <section className="mx-auto min-h-[50vh] max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">
        {locale === "ar" ? "الصفحة الرئيسية" : "Home Page"}
      </h1>

      <p className="mt-4">
        {locale === "ar"
          ? "سيتم نقل محتوى الصفحة الرئيسية هنا."
          : "The existing homepage content will be migrated here."}
      </p>
    </section>
  );
}
