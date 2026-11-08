export const audienceIds = [
  "toddlers",
  "juniors",
  "school-students",
  "teens",
  "adult-academic",
  "career",
  "university",
] as const;

export type AudienceId = (typeof audienceIds)[number];
export type AudienceCategory = "young-learners" | "study-and-career";

const catalog: Array<{
  id: AudienceId;
  category: AudienceCategory;
  image: string;
  age?: { ar: string; en: string; fr: string };
}> = [
  { id: "toddlers", category: "young-learners", image: "/voxbridge/audiences/toddlers.jpg", age: { ar: "٤–٧ سنوات", en: "Ages 4–7", fr: "4–7 ans" } },
  { id: "juniors", category: "young-learners", image: "/voxbridge/audiences/juniors.jpg", age: { ar: "٧–١٠ سنوات", en: "Ages 7–10", fr: "7–10 ans" } },
  { id: "school-students", category: "young-learners", image: "/voxbridge/audiences/school-students.jpg", age: { ar: "١٠–١٤ سنة", en: "Ages 10–14", fr: "10–14 ans" } },
  { id: "teens", category: "young-learners", image: "/voxbridge/audiences/teens.jpg", age: { ar: "١٥–١٧ سنة", en: "Ages 15–17", fr: "15–17 ans" } },
  { id: "adult-academic", category: "study-and-career", image: "/voxbridge/audiences/adult-academic.jpg" },
  { id: "career", category: "study-and-career", image: "/voxbridge/audiences/career.jpg" },
  { id: "university", category: "study-and-career", image: "/voxbridge/audiences/university.jpg" },
];

const audienceNames = {
  ar: {
    toddlers: "الصغار",
    juniors: "الناشئة",
    "school-students": "تلاميذ المدرسة",
    teens: "المراهقون",
    "adult-academic": "المسار الأكاديمي",
    career: "المسار المهني",
    university: "المسار الجامعي",
  },
  en: {
    toddlers: "Toddlers",
    juniors: "Juniors",
    "school-students": "School students",
    teens: "Teens",
    "adult-academic": "Adult academic pathway",
    career: "Career pathway",
    university: "University pathway",
  },
  fr: {
    toddlers: "Petits apprenants",
    juniors: "Juniors",
    "school-students": "Élèves",
    teens: "Adolescents",
    "adult-academic": "Parcours académique adulte",
    career: "Parcours professionnel",
    university: "Parcours universitaire",
  },
} as const;

const categoryNames = {
  ar: { "young-learners": "للأطفال واليافعين", "study-and-career": "للدراسة والعمل" },
  en: { "young-learners": "Children & teens", "study-and-career": "Study & career pathways" },
  fr: { "young-learners": "Enfants et adolescents", "study-and-career": "Études et carrière" },
} as const;

export const audienceLanguageLabels = {
  ar: { English: "الإنجليزية", French: "الفرنسية", German: "الألمانية", Spanish: "الإسبانية", comingSoon: "قريباً" },
  en: { English: "English", French: "French", German: "German", Spanish: "Spanish", comingSoon: "Coming soon" },
  fr: { English: "Anglais", French: "Français", German: "Allemand", Spanish: "Espagnol", comingSoon: "Bientôt" },
} as const;

const languages = [
  { name: "English", slug: "english", available: true },
  { name: "French", slug: "french", available: true },
  { name: "German", slug: "german", available: false },
  { name: "Spanish", slug: "spanish", available: false },
] as const;

function localeFor(locale: string): "ar" | "en" | "fr" {
  return locale === "ar" || locale === "fr" ? locale : "en";
}

export function audienceGroupsFor(locale: string) {
  const language = localeFor(locale);
  return (["young-learners", "study-and-career"] as const).map(category => ({
    id: category,
    title: categoryNames[language][category],
    audiences: catalog
      .filter(audience => audience.category === category)
      .map(audience => ({
        ...audience,
        title: audienceNames[language][audience.id],
        ageRange: audience.age?.[language],
      })),
  }));
}

export function audienceFor(id: string | undefined, locale: string) {
  if (!id || !audienceIds.some(audienceId => audienceId === id)) return undefined;
  const language = localeFor(locale);
  const audience = catalog.find(item => item.id === id);
  if (!audience) return undefined;
  return {
    ...audience,
    title: audienceNames[language][audience.id],
    ageRange: audience.age?.[language],
  };
}

export function languagesForAudience(locale: string) {
  const labels = audienceLanguageLabels[localeFor(locale)];
  return languages.map(language => ({
    ...language,
    label: labels[language.name],
    comingSoon: labels.comingSoon,
  }));
}
