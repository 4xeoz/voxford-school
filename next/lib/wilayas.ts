// The 58 wilayas of Algeria, as of the 2019 administrative reorganisation
// that promoted the ten southern delegations (49–58) to full wilayas.
//
// Applicants store `wilayaCode`, not a name. A code is stable, can't be
// misspelled, and lets the display name be localised without migrating data.

export interface Wilaya {
  code: number;
  nameLatin: string;
  nameAr: string;
}

export const WILAYAS: Wilaya[] = [
  { code: 1, nameLatin: "Adrar", nameAr: "أدرار" },
  { code: 2, nameLatin: "Chlef", nameAr: "الشلف" },
  { code: 3, nameLatin: "Laghouat", nameAr: "الأغواط" },
  { code: 4, nameLatin: "Oum El Bouaghi", nameAr: "أم البواقي" },
  { code: 5, nameLatin: "Batna", nameAr: "باتنة" },
  { code: 6, nameLatin: "Béjaïa", nameAr: "بجاية" },
  { code: 7, nameLatin: "Biskra", nameAr: "بسكرة" },
  { code: 8, nameLatin: "Béchar", nameAr: "بشار" },
  { code: 9, nameLatin: "Blida", nameAr: "البليدة" },
  { code: 10, nameLatin: "Bouira", nameAr: "البويرة" },
  { code: 11, nameLatin: "Tamanrasset", nameAr: "تمنراست" },
  { code: 12, nameLatin: "Tébessa", nameAr: "تبسة" },
  { code: 13, nameLatin: "Tlemcen", nameAr: "تلمسان" },
  { code: 14, nameLatin: "Tiaret", nameAr: "تيارت" },
  { code: 15, nameLatin: "Tizi Ouzou", nameAr: "تيزي وزو" },
  { code: 16, nameLatin: "Alger", nameAr: "الجزائر" },
  { code: 17, nameLatin: "Djelfa", nameAr: "الجلفة" },
  { code: 18, nameLatin: "Jijel", nameAr: "جيجل" },
  { code: 19, nameLatin: "Sétif", nameAr: "سطيف" },
  { code: 20, nameLatin: "Saïda", nameAr: "سعيدة" },
  { code: 21, nameLatin: "Skikda", nameAr: "سكيكدة" },
  { code: 22, nameLatin: "Sidi Bel Abbès", nameAr: "سيدي بلعباس" },
  { code: 23, nameLatin: "Annaba", nameAr: "عنابة" },
  { code: 24, nameLatin: "Guelma", nameAr: "قالمة" },
  { code: 25, nameLatin: "Constantine", nameAr: "قسنطينة" },
  { code: 26, nameLatin: "Médéa", nameAr: "المدية" },
  { code: 27, nameLatin: "Mostaganem", nameAr: "مستغانم" },
  { code: 28, nameLatin: "M'Sila", nameAr: "المسيلة" },
  { code: 29, nameLatin: "Mascara", nameAr: "معسكر" },
  { code: 30, nameLatin: "Ouargla", nameAr: "ورقلة" },
  { code: 31, nameLatin: "Oran", nameAr: "وهران" },
  { code: 32, nameLatin: "El Bayadh", nameAr: "البيض" },
  { code: 33, nameLatin: "Illizi", nameAr: "إليزي" },
  { code: 34, nameLatin: "Bordj Bou Arréridj", nameAr: "برج بوعريريج" },
  { code: 35, nameLatin: "Boumerdès", nameAr: "بومرداس" },
  { code: 36, nameLatin: "El Tarf", nameAr: "الطارف" },
  { code: 37, nameLatin: "Tindouf", nameAr: "تندوف" },
  { code: 38, nameLatin: "Tissemsilt", nameAr: "تيسمسيلت" },
  { code: 39, nameLatin: "El Oued", nameAr: "الوادي" },
  { code: 40, nameLatin: "Khenchela", nameAr: "خنشلة" },
  { code: 41, nameLatin: "Souk Ahras", nameAr: "سوق أهراس" },
  { code: 42, nameLatin: "Tipaza", nameAr: "تيبازة" },
  { code: 43, nameLatin: "Mila", nameAr: "ميلة" },
  { code: 44, nameLatin: "Aïn Defla", nameAr: "عين الدفلى" },
  { code: 45, nameLatin: "Naâma", nameAr: "النعامة" },
  { code: 46, nameLatin: "Aïn Témouchent", nameAr: "عين تموشنت" },
  { code: 47, nameLatin: "Ghardaïa", nameAr: "غرداية" },
  { code: 48, nameLatin: "Relizane", nameAr: "غليزان" },
  { code: 49, nameLatin: "Timimoun", nameAr: "تيميمون" },
  { code: 50, nameLatin: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار" },
  { code: 51, nameLatin: "Ouled Djellal", nameAr: "أولاد جلال" },
  { code: 52, nameLatin: "Béni Abbès", nameAr: "بني عباس" },
  { code: 53, nameLatin: "In Salah", nameAr: "عين صالح" },
  { code: 54, nameLatin: "In Guezzam", nameAr: "عين قزام" },
  { code: 55, nameLatin: "Touggourt", nameAr: "تقرت" },
  { code: 56, nameLatin: "Djanet", nameAr: "جانت" },
  { code: 57, nameLatin: "El M'Ghair", nameAr: "المغير" },
  { code: 58, nameLatin: "El Meniaa", nameAr: "المنيعة" },
];

const BY_CODE = new Map(WILAYAS.map((w) => [w.code, w]));

export function getWilaya(code: number | null | undefined): Wilaya | undefined {
  if (code === null || code === undefined) return undefined;
  return BY_CODE.get(code);
}

/** Display label for a wilaya, e.g. "28 — M'Sila" (or the Arabic name in `ar`). */
export function wilayaLabel(code: number | null | undefined, locale = "en"): string {
  const w = getWilaya(code);
  if (!w) return "—";
  const name = locale === "ar" ? w.nameAr : w.nameLatin;
  return `${String(w.code).padStart(2, "0")} — ${name}`;
}

export function isValidWilayaCode(code: unknown): code is number {
  return typeof code === "number" && Number.isInteger(code) && BY_CODE.has(code);
}
