// src/components/Home/RightRail.jsx
// Desktop (xl+) right rail. Shared by home and category pages.
import LibraryCard from "./LibraryCard";
import AskCard from "./AskCard";
import ContributeCard from "./ContributeCard";

export default function RightRail({
  locale,
  bookCount,
  topic,
  showAsk = false,
  askHref,
}) {
  return (
    <div className="space-y-4">
      <LibraryCard locale={locale} bookCount={bookCount} topic={topic} />
      {showAsk && <AskCard locale={locale} topic={topic} href={askHref} />}
      <ContributeCard locale={locale} />
    </div>
  );
}
