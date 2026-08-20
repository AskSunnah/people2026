"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import IntroSection from "./IntroSection";
import AskQuestionModal from "./AskQuestionModal";

export default function AskQuestionSection({ direction = "ltr", locale = "en" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tIntro = useTranslations("home.intro");
  const tModal = useTranslations("home.modal");

  return (
    <>
      <IntroSection
        heading={tIntro("heading")}
        description={tIntro("description")}
        buttonLabel={tIntro("askButton")}
        onOpenModal={() => setIsModalOpen(true)}
        locale={locale}
        direction={direction}
      />

      <AskQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={locale}
        direction={direction}
        t={tModal}
      />
    </>
  );
}
