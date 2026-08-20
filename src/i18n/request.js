// // src/i18n/request.js
// import { hasLocale } from "next-intl";
// import { getRequestConfig } from "next-intl/server";
// import { routing } from "./routing";

// export default getRequestConfig(async ({ requestLocale }) => {
//   const requestedLocale = await requestLocale;

//   const locale = hasLocale(routing.locales, requestedLocale)
//     ? requestedLocale
//     : routing.defaultLocale;

//   const [commonMessages, homeMessages, questionMessages, notFoundMessages, searchMessages] =
//     await Promise.all([
//       import(`../translations/${locale}/common.json`).then((m) => m.default),
//       import(`../translations/${locale}/home.json`).then((m) => m.default),
//       import(`../translations/${locale}/question.json`).then((m) => m.default),
//       import(`../translations/${locale}/notFound.json`).then((m) => m.default),
//       import(`../translations/${locale}/search.json`).then((m) => m.default),
//     ]);

//   return {
//     locale,
//     messages: {
//       common: commonMessages,
//       home: homeMessages,
//       question: questionMessages,
//       notFound: notFoundMessages,
//       search: searchMessages,
//     },
//   };
// });



// src/i18n/request.js
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const [
    commonMessages,
    homeMessages,
    questionMessages,
    notFoundMessages,
    searchMessages,
    aboutMessages,
    feedbackMessages,
    termsMessages,
    contributeMessages
  ] = await Promise.all([
    import(`../translations/${locale}/common.json`).then((m) => m.default),
    import(`../translations/${locale}/home.json`).then((m) => m.default),
    import(`../translations/${locale}/question.json`).then((m) => m.default),
    import(`../translations/${locale}/notFound.json`).then((m) => m.default),
    import(`../translations/${locale}/search.json`).then((m) => m.default),
    import(`../translations/${locale}/about.json`).then((m) => m.default),
    import(`../translations/${locale}/feedback.json`).then((m) => m.default),
    import(`../translations/${locale}/terms.json`).then((m) => m.default),
    import(`../translations/${locale}/contribute.json`).then((m) => m.default),
  ]);

  return {
    locale,
    messages: {
      common: commonMessages,
      home: homeMessages,
      question: questionMessages,
      notFound: notFoundMessages,
      search: searchMessages,
      about: aboutMessages,
      feedback: feedbackMessages,
      terms: termsMessages,
      contribute: contributeMessages
    },
  };
});