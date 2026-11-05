// src/components/Home/AskQuestionSection.jsx
import { useTranslations } from "next-intl";
import IntroSection from "./IntroSection";

export default function AskQuestionSection({
  direction = "ltr",
  locale = "en",
}) {
  const tIntro = useTranslations("home.intro");

  return (
    <IntroSection
      heading={tIntro("heading")}
      description={tIntro("description")}
      buttonLabel={tIntro("askButton")}
      href="/ask"
      locale={locale}
      direction={direction}
    />
  );
}
