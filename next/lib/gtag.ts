export const GA_MEASUREMENT_ID = "G-R5N0MPBFQQ";

// Extend the window object so TypeScript knows about gtag
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

/** Send a GA4 page_view hit — called on route changes */
export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

/** Generic GA4 event helper */
export function event(
  action: string,
  params?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: unknown;
  }
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params ?? {});
}

// ─── Pre-typed event helpers ──────────────────────────────────────────────────

export const trackContactFormSubmit = (studyField: string, country: string) =>
  event("contact_form_submit", {
    category: "engagement",
    label: `${studyField} · ${country}`,
    study_field: studyField,
    destination_country: country,
  });

export const trackWhatsAppClick = (source: "navbar" | "footer" | "hero" | "widget" | "contact") =>
  event("whatsapp_click", { category: "cta", label: source });

export const trackGetStartedClick = (source: "navbar" | "hero") =>
  event("get_started_click", { category: "cta", label: source });

export const trackPhoneCall = (number: string) =>
  event("phone_call_click", { category: "contact", label: number });

export const trackEmailClick = () =>
  event("email_click", { category: "contact", label: "contact@nopeca.com" });

export const trackLanguageSwitch = (to: string) =>
  event("language_switch", { category: "ux", label: to });

export const trackBlogClick = () =>
  event("blog_click", { category: "navigation" });
