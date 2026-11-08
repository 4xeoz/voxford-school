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
  ageGroup: { ar: string; en: string; fr: string };
  segment: { ar: string; en: string; fr: string };
  heading: { ar: string; en: string; fr: string };
  description: { ar: string; en: string; fr: string };
}> = [
  {
    id: "toddlers", category: "young-learners", image: "/voxbridge/audiences/toddlers.jpg",
    age: { ar: "4–7 سنوات", en: "Ages 4–7", fr: "4–7 ans" }, ageGroup: { ar: "لأطفال الروضة", en: "For toddlers", fr: "Pour tout-petits" }, segment: { ar: "الصغار", en: "Toddlers", fr: "Tout-petits" },
    heading: { ar: "بداية لطيفة مع لغة جديدة", en: "A gentle first step into language", fr: "Un premier pas en douceur vers la langue" },
    description: { ar: "مسار يراعي عمر الطفل، ويمنحه مساحة للتعرّف إلى اللغة خطوة بخطوة.", en: "A pathway shaped around a young learner's stage, with room to discover a new language step by step.", fr: "Un parcours adapté aux jeunes enfants, pour découvrir une nouvelle langue pas à pas." },
  },
  {
    id: "juniors", category: "young-learners", image: "/voxbridge/audiences/juniors.jpg",
    age: { ar: "7–10 سنوات", en: "Ages 7–10", fr: "7–10 ans" }, ageGroup: { ar: "للأطفال", en: "For children", fr: "Pour enfants" }, segment: { ar: "الناشئة", en: "Juniors", fr: "Juniors" },
    heading: { ar: "وسّع عالمك، كلمةً بعد كلمة", en: "Grow your world, one word at a time", fr: "Élargissez votre horizon, mot après mot" },
    description: { ar: "بداية تساعد الناشئ على بناء مفرداته والتعبير عن أفكاره في مواقف متنوعة.", en: "A starting point for growing vocabulary and expressing ideas in a range of everyday situations.", fr: "Un point de départ pour enrichir son vocabulaire et exprimer ses idées dans des situations variées." },
  },
  {
    id: "school-students", category: "young-learners", image: "/voxbridge/audiences/school-students.jpg",
    age: { ar: "10–14 سنة", en: "Ages 10–14", fr: "10–14 ans" }, ageGroup: { ar: "لتلاميذ المدرسة", en: "For school students", fr: "Pour les élèves" }, segment: { ar: "طلاب المدرسة", en: "School students", fr: "Élèves" },
    heading: { ar: "لغة أقوى للدراسة والحياة", en: "Language for school and beyond", fr: "La langue pour l'école et la suite" },
    description: { ar: "مسار يربط تعلّم اللغة بما يحتاجه الطالب في دراسته وتواصله اليومي.", en: "A pathway that connects language learning with students' studies and everyday communication.", fr: "Un parcours qui relie l'apprentissage de la langue aux études et à la communication quotidienne." },
  },
  {
    id: "teens", category: "young-learners", image: "/voxbridge/audiences/teens.jpg",
    age: { ar: "15–17 سنة", en: "Ages 15–17", fr: "15–17 ans" }, ageGroup: { ar: "للمراهقين", en: "For teens", fr: "Pour adolescents" }, segment: { ar: "المراهقون", en: "Teens", fr: "Adolescents" },
    heading: { ar: "عبّر عن أفكارك بثقة أكبر", en: "Express your ideas with confidence", fr: "Exprimez vos idées avec assurance" },
    description: { ar: "تدرّب على التواصل، النقاش، والعروض استعداداً لما ينتظرك في الدراسة والحياة.", en: "Practice communication, discussion and presentations for the moments ahead in study and life.", fr: "Pratiquez la communication, les échanges et les présentations pour la suite de vos études et de votre vie." },
  },
  {
    id: "adult-academic", category: "study-and-career", image: "/voxbridge/audiences/adult-academic.jpg",
    ageGroup: { ar: "للبالغين", en: "For adults", fr: "Pour adultes" }, segment: { ar: "الدراسة الأكاديمية", en: "Academic study", fr: "Études académiques" },
    heading: { ar: "استعد لخطوتك الأكاديمية القادمة", en: "Prepare for your next academic step", fr: "Préparez votre prochaine étape académique" },
    description: { ar: "مسار لمن يستعد للدراسة الأكاديمية أو يريد استخدام اللغة في سياق تعليمي.", en: "A pathway for people preparing for academic study or looking to use a language in an educational setting.", fr: "Un parcours pour préparer des études ou utiliser la langue dans un contexte éducatif." },
  },
  {
    id: "career", category: "study-and-career", image: "/voxbridge/audiences/career.jpg",
    ageGroup: { ar: "للمهنيين", en: "For professionals", fr: "Pour les professionnels" }, segment: { ar: "المسار المهني", en: "Career pathway", fr: "Parcours professionnel" },
    heading: { ar: "تواصل بثقة في مسارك المهني", en: "Communicate with confidence at work", fr: "Communiquez avec assurance au travail" },
    description: { ar: "تدرّب على التواصل والتعبير عن أفكارك في مواقف مهنية، ومنها المقابلات.", en: "Practice communicating and expressing your ideas in professional situations, including interviews.", fr: "Pratiquez la communication et l'expression de vos idées en contexte professionnel, notamment en entretien." },
  },
  {
    id: "university", category: "study-and-career", image: "/voxbridge/audiences/university.jpg",
    ageGroup: { ar: "للجامعيين", en: "For university students", fr: "Pour les étudiants" }, segment: { ar: "المسار الجامعي", en: "University pathway", fr: "Parcours universitaire" },
    heading: { ar: "لغة تواكب طموحك الجامعي", en: "Language for your university ambitions", fr: "Une langue au service de vos ambitions universitaires" },
    description: { ar: "مسار يناسب طموحات الدراسة الجامعية ويهيئك للتواصل في سياقات أكاديمية.", en: "A pathway for university goals, with practice for communicating in academic settings.", fr: "Un parcours lié à vos projets universitaires, avec une pratique de la communication en contexte académique." },
  },
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
        ageGroup: audience.ageGroup[language],
        segment: audience.segment[language],
        heading: audience.heading[language],
        description: audience.description[language],
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
    ageGroup: audience.ageGroup[language],
    segment: audience.segment[language],
    heading: audience.heading[language],
    description: audience.description[language],
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
