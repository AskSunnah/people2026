// src/lib/seo.js
export const SITE_URL = "https://asksunnah.com";
export const SITE_NAME = "Ask Sunnah";
export const DEFAULT_OG_IMAGE = "/og-default.jpg"; // put this file in /public, 1200x630

export function absoluteUrl(path = "") {
  return new URL(path, SITE_URL).toString();
}

// Each locale is independent content here (not a translation of the other),
// so we only self-reference a canonical — no cross-locale hreflang mapping.
export function buildAlternates(locale, path = "/") {
  const normalized = path === "/" ? "" : path;
  return {
    canonical: absoluteUrl(`/${locale}${normalized}`),
  };
}

export const NOINDEX = { index: false, follow: false };
export const NOINDEX_FOLLOW = { index: false, follow: true };

/**
 * Single source of truth for page <head> metadata.
 * `title` must be the RAW page title with no site name in it —
 * the root layout's title.template appends " | Ask Sunnah" for you.
 */
export function buildMetadata({
  locale,
  path = "/",
  title,
  description,
  image,
  type = "website",
  robots,
}) {
  const url = absoluteUrl(`/${locale}${path === "/" ? "" : path}`);
  const ogImage = image || DEFAULT_OG_IMAGE;

  const metadata = {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };

  if (robots) metadata.robots = robots;

  return metadata;
}