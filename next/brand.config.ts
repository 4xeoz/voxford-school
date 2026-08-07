/**
 * Single source of truth for everything brand-specific.
 *
 * The point of this file is that spinning up another site should mean editing
 * THIS file plus the colour variables in app/globals.css plus the image files
 * in public/ — and nothing else.
 *
 * The codebase does not use it yet: brand strings are still hardcoded across
 * ~32 files. See REBRANDING.md at the repo root for the full inventory and the
 * order to migrate them in.
 *
 * When you touch a file that hardcodes the brand, replace the literal with a
 * reference here. Over time the hardcoded list empties out.
 */

export const brand = {
  /** Display name, used in headings, nav, and copy. */
  name: "Oxbridge School",

  /** Short form for tight spaces (mobile nav, footer). */
  shortName: "Oxbridge",

  /** Used in <title> templates: "Page — Oxbridge School". */
  titleSuffix: "Oxbridge School",

  /** One-line description for meta tags and JSON-LD. */
  description: "",

  /** Legal entity name for the footer copyright line. */
  legalName: "Oxbridge School",

  /**
   * Canonical origin, no trailing slash. Drives sitemap.ts, robots.ts,
   * canonical URLs, and Open Graph tags.
   * Prefer the env var so preview deploys resolve correctly.
   */
  url: process.env.WEBSITE_URL ?? "https://oxbridgeschool.com",

  contact: {
    email: "",
    phone: "",
    address: "",
  },

  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  },

  /**
   * Asset paths, relative to public/. Keeping them here means swapping a logo
   * is a one-line change rather than a hunt through components.
   */
  assets: {
    logo: "/logo.png",
    logoText: "/logo-text.png",
    footerLogo: "/footer-logo.png",
    ogImage: "/og-image.png",
    favicon: "/favicon.ico",
  },
} as const;

export type Brand = typeof brand;
