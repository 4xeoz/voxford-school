/**
 * Single source of truth for how to reach the school.
 *
 * These values were previously copy-pasted across FooterSection,
 * ContactPageClient, Navbar and the event page — 11 sites for the phone
 * numbers alone — so a number change shipped to some surfaces and not others.
 */

/**
 * Master switch for phone and WhatsApp contact across the public site.
 *
 * Set to false while the school has no line to answer: every number, tel:
 * link, WhatsApp button and the structured-data telephone entries disappear
 * together. Nothing is deleted — flip this back to true and they all return.
 *
 * Keep the numbers below accurate even while hidden, or turning this on again
 * ships stale ones.
 */
export const SHOW_PHONE_CONTACT = false;

export const WHATSAPP_NUMBER = "213656781080";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const CONTACT_EMAIL = "voxbridgeschool@gmail.com";

/** Where job applications sent by email land. */
export const CAREERS_EMAIL = "voxbridgeschool@gmail.com";

export const PHONES = [
  { display: "0560 409 193", tel: "+213560409193", track: "0560409193" },
  { display: "0560 409 195", tel: "+213560409195", track: "0560409195" },
] as const;

/**
 * Line for the /connect social-media landing page. Kept separate from
 * PHONES/SHOW_PHONE_CONTACT above — this page always shows a live number
 * regardless of that master switch, since its whole purpose is quick calls
 * from social traffic.
 */
export const CONNECT_PHONE = {
  display: "0656 781 080",
  tel: "+213656781080",
} as const;

/** M'Sila, Algeria. */
export const MAP_COORDS = "35.7058,4.5419";
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${MAP_COORDS}&hl=en&z=15&output=embed`;
export const MAPS_DIRECTIONS = "https://maps.app.goo.gl/BUHQjufMk1oBnQ4Q9";

/** Languages offered, used by the lead-form dropdown. */
export const LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "German",
  "Italian",
  "Turkish",
  "Chinese (Mandarin)",
  "Japanese",
  "Korean",
  "Russian",
  "Arabic",
  "Not sure yet",
] as const;

export const START_DATES = [
  "As soon as you open",
  "Within 3 months",
  "Later this year",
  "Not sure yet",
] as const;
