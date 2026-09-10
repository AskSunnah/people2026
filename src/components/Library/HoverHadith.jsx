"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function HoverHadith() {
  const locale = useLocale();
  const t = useTranslations("library.landing");

  const isArabic = locale === "ar";

  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [topOffset, setTopOffset] = useState(120);

  const timerRef = useRef(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Measure Header + Navbar area so popup begins below them.
  useEffect(() => {
    const measure = () => {
      const navbar = document.querySelector("nav");

      if (navbar) {
        setTopOffset(navbar.getBoundingClientRect().bottom + 8);
      }
    };

    measure();

    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  const handleEnter = () => {
    if (isMobile) return;

    timerRef.current = setTimeout(() => {
      setShow(true);
    }, 2000);
  };

  const handleLeave = () => {
    if (isMobile) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setShow(false);
  };

  return (
    <div
      className="relative inline-block group"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Welcome text */}
      <span
        className="
    text-[clamp(1.25rem,3vw,2rem)]
    text-[#2b2b2b]
    cursor-pointer
    transition-colors
    duration-300
    ease-in-out
    hover:text-[#c3a421]
  "
      >
        {t("welcome")}

        {/* Only visible while hovering */}
        {!isMobile && (
          <span
            className="
              absolute
              bottom-[115%]
              left-1/2
              -translate-x-1/2

              bg-black/90
              text-white

              px-3 py-2
              rounded-md

              text-[0.75rem]
              leading-none
              font-semibold
              whitespace-nowrap

              opacity-0
              invisible
              pointer-events-none

              transition-all duration-200

              group-hover:opacity-100
              group-hover:visible
            "
          >
            {t("hoverHint")}
          </span>
        )}
      </span>

      {/* English popup */}
      {!isArabic && !isMobile && show && (
        <div
          className="
            fixed
            right-[40px]
            bottom-[5vh]

            w-[min(400px,calc(100vw-80px))]
            overflow-y-auto

            bg-white/15
            backdrop-blur-[20px]

            border-2
            border-[rgba(195,164,33,0.5)]
            rounded-2xl

            p-5

            text-white
            font-normal
            text-left

            shadow-[0_8px_32px_rgba(0,0,0,0.3)]

            z-[999]

            [animation:fadeInLeft_0.6s_ease_forwards]
          "
          style={{
            top: `${topOffset}px`,
            direction: "ltr",
          }}
        >
          <p
            className="
              text-left
              text-[clamp(0.85rem,1.4vw,1.05rem)]
              leading-[1.7]
              text-white
              font-normal
              text-justify
              [text-justify:inter-word]
            "
            style={{
              fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            I came to the Messenger of Allah, peace and blessings be upon him,
            while he was reclining in the mosque on a red cloak of his. I said
            to him, 'O Messenger of Allah, I have come seeking knowledge.' He
            said,{" "}
            <span className="relative text-[#3cb371] font-bold cursor-pointer transition-colors duration-300 group/hl">
              "Welcome, seeker of knowledge."
              <span
                className="
                  absolute
                  bottom-[120%]
                  left-1/2
                  -translate-x-1/2

                  bg-black/80
                  text-white

                  px-2 py-1
                  rounded-md

                  text-[0.75rem]
                  font-normal
                  whitespace-nowrap

                  opacity-0
                  pointer-events-none

                  transition-opacity duration-300

                  group-hover/hl:opacity-100
                "
              >
                interactive
              </span>
              <span
                className="
                  absolute
                  bottom-[110%]
                  left-1/2
                  -translate-x-1/2

                  w-0 h-0

                  border-[5px]
                  border-solid
                  border-t-black/80
                  border-x-transparent
                  border-b-transparent

                  opacity-0
                  transition-opacity duration-300

                  group-hover/hl:opacity-100
                "
              />
            </span>{" "}
            Indeed, the seeker of knowledge is surrounded by the angels and
            shaded by their wings, then they mount one upon another until they
            reach the lowest heaven, out of their love for what he is seeking.
            Safwan said, 'O Messenger of Allah, we are constantly traveling
            between Mecca and Medina, so give us a ruling about wiping over the
            leather socks.' The Messenger of Allah, peace and blessings be upon
            him, said to him, 'Three days for the traveler, and one day and one
            night for the resident.'
            <br />
            <br />
            <strong>Narrator:</strong> Safwan ibn Assal
            <br />
            <strong>Scholar:</strong> al-Albani
            <br />
            <strong>Source:</strong> al-Silsilah al-Sahihah (7/1176)
            <br />
            <strong>Ruling:</strong> hasan (sound)
          </p>
        </div>
      )}

      {/* Arabic popup */}
      {isArabic && !isMobile && show && (
        <div
          className="
            fixed
            right-[40px]
            bottom-[5vh]

            w-[min(400px,calc(100vw-80px))]
            overflow-y-auto

            bg-white/15
            backdrop-blur-[20px]

            border-2
            border-[rgba(195,164,33,0.5)]
            rounded-2xl

            p-5

            text-white
            text-[clamp(0.8rem,1.4vw,1rem)]
            font-normal
            text-right

            shadow-[0_8px_32px_rgba(0,0,0,0.3)]

            z-[999]

            [animation:fadeInLeft_0.6s_ease_forwards]
          "
          style={{
            top: `${topOffset}px`,
            direction: "ltr",
            unicodeBidi: "bidi-override",
            lineHeight: "1.6",
          }}
        >
          <p
            dir="rtl"
            className="
              text-right
              text-[clamp(0.8rem,1.4vw,1rem)]
              leading-[1.8]
              font-normal
            "
          >
            أتيتُ رسولَ اللهِ صلَّى اللهُ عليهِ وسلَّمَ وهو مُتَّكِئٌ في المسجدِ
            على بُرْدٍ لهُ أحمرَ فقلتُ لهُ يا رسولَ اللهِ إني جئتُ أطلبُ
            العِلْمَ فقال{" "}
            <span className="relative text-[#3cb371] font-bold cursor-pointer transition-colors duration-300 group/hl">
              مرحبًا بطالبِ العِلْمِ
              <span
                className="
                  absolute
                  bottom-[120%]
                  left-1/2
                  -translate-x-1/2

                  bg-black/80
                  text-white

                  px-2 py-1
                  rounded-md

                  text-[0.75rem]
                  font-normal
                  whitespace-nowrap

                  opacity-0
                  pointer-events-none

                  transition-opacity duration-300

                  group-hover/hl:opacity-100
                "
              >
                interactive
              </span>
            </span>{" "}
            إنَّ طالبَ العِلْمِ لتحُفَّهُ الملائكةُ وتَظُلَّهُ بأجنحتِها ثم
            يركبُ بعضُهم بعضًا حتى يبلغوا السماءَ الدنيا من حُبِّهِمْ لما يطلبُ
            قال قال صفوانُ يا رسولَ اللهِ لا نزالُ نسافرُ بينَ مكةَ والمدينةَ
            فأَفْتِنَا عن المسحِ على الخُفَّيْنِ فقال لهُ رسولِ اللهِ صلَّى
            اللهُ عليهِ وسلَّمَ ثلاثةُ أيامٍ للمسافرِ ويومٌ وليلةٌ للمقيمِ
            <br />
            <br />
            <strong>الراوي:</strong> صفوان بن عسال
            <br />
            <strong>المحدث:</strong> الألباني
            <br />
            <strong>المصدر:</strong> السلسلة الصحيحة (7/1176)
            <br />
            <strong>خلاصة حكم المحدث:</strong> إسناده حسن
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
