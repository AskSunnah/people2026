export default async function BookDetailsPage({ params }) {
  const { locale, slug } = await params;

  return (
    <main>
      <h1>Book Details</h1>

      <p>Locale: {locale}</p>
      <p>Slug: {slug}</p>
    </main>
  );
}
