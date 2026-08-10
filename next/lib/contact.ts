/**
 * Single source of truth for how to reach the school.
 *
 * These values were previously copy-pasted across FooterSection,
 * ContactPageClient, Navbar and the event page — 11 sites for the phone
 * numbers alone — so a number change shipped to some surfaces and not others.
 */

export const WHATSAPP_NUMBER = "447879003218";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const CONTACT_EMAIL = "contact@voxford.com";

export const PHONES = [
  { display: "0560 409 193", tel: "+213560409193", track: "0560409193" },
  { display: "0560 409 195", tel: "+213560409195", track: "0560409195" },
] as const;

/** M'Sila, Algeria. */
export const MAP_COORDS = "35.7058,4.5419";
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${MAP_COORDS}&hl=en&z=15&output=embed`;
export const MAPS_DIRECTIONS = `https://maps.google.com/?q=${MAP_COORDS}`;

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
