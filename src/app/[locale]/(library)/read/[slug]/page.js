export default async function ReadBookPage({ params }) {
  const { locale, slug } = await params;

  return (
    <main>
      <h1>Read Book</h1>

      <p>Locale: {locale}</p>
      <p>Slug: {slug}</p>
    </main>
  );
}
