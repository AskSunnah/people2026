"use client";

// src/components/Question/QuestionSearchBar.jsx
import { useRouter } from "@/i18n/navigation";
import SearchBarQuestion from "@/components/common/SearchBarQuestion";

export default function QuestionSearchBar({ direction = "ltr", placeholder }) {
  const router = useRouter();

  const handleSubmit = (query) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=1`);
  };

  return (
    <SearchBarQuestion direction={direction} placeholder={placeholder} onSubmit={handleSubmit} />
  );
}
