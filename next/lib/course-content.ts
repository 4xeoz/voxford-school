export const courseSlugs = ["english", "french"] as const;
export type CourseSlug = (typeof courseSlugs)[number];

type Locale = "ar" | "en" | "fr";

export const courseSectionCopy = {
  ar: {
    eyebrow: "مسارات حسب الفئة",
    title: "مسار يناسب مرحلتك وهدفك.",
    lead: "اختر الفئة الأقرب إلى عمرك أو طموحك، ثم تعرّف على المسار المناسب لخطوتك التالية.",
    readMore: "تعرّف أكثر",
    previous: "الفئات السابقة",
    next: "الفئات التالية",
    carousel: "مسارات اللغات حسب الفئة",
  },
  en: {
    eyebrow: "Courses by learner group",
    title: "A pathway for your stage and goals.",
    lead: "Choose the group that fits your age or ambitions, then explore the pathway built around it.",
    readMore: "Read more",
    previous: "Previous groups",
    next: "Next groups",
    carousel: "Language pathways by learner group",
  },
  fr: {
    eyebrow: "Cours par public",
    title: "Un parcours adapté à votre étape et vos objectifs.",
    lead: "Choisissez le groupe qui correspond à votre âge ou à vos ambitions, puis découvrez le parcours adapté.",
    readMore: "En savoir plus",
    previous: "Groupes précédents",
    next: "Groupes suivants",
    carousel: "Parcours linguistiques par public",
  },
} as const;

export const audienceDetailCopy = {
  ar: {
    back: "العودة إلى المسارات",
    languageTitle: "اختر اللغة التي تهمّك",
    languageLead: "تعرّف على تفاصيل المسار المتاح، واسألنا عن الخطوة التالية.",
    available: "متاح",
    comingSoon: "قريباً",
  },
  en: {
    back: "Back to pathways",
    languageTitle: "Choose the language you are interested in",
    languageLead: "Explore the available pathway details and ask us about your next step.",
    available: "Available",
    comingSoon: "Coming soon",
  },
  fr: {
    back: "Retour aux parcours",
    languageTitle: "Choisissez la langue qui vous intéresse",
    languageLead: "Découvrez les parcours disponibles et renseignez-vous sur la prochaine étape.",
    available: "Disponible",
    comingSoon: "Bientôt",
  },
} as const;

export const audienceLanguageCopy = {
  ar: { available: "متاح", comingSoon: "قريباً", chooseLanguage: "اختر اللغة" },
  en: { available: "Available", comingSoon: "Coming soon", chooseLanguage: "Choose a language" },
  fr: { available: "Disponible", comingSoon: "Bientôt", chooseLanguage: "Choisir une langue" },
} as const;

export const coursePageCopy = {
  ar: {
    back: "العودة إلى الدورات",
    approachEyebrow: "كيف تبدأ التجربة؟",
    approachTitle: "بداية تناسب ما تريد فعله باللغة.",
    steps: [
      { number: "01", title: "حدّد هدفك", body: "أخبرنا بالموقف الذي تريد الاستعداد له ومستواك الحالي، لنساعدك على اختيار البداية المناسبة." },
      { number: "02", title: "تدرّب على استخدامها", body: "شارك في الحديث، العروض، والأنشطة التي تجعل اللغة أداة للتعبير والعمل مع الآخرين." },
      { number: "03", title: "اكتشف ما بعدها", body: "اسألنا عن فرص التعلّم في بلد اللغة خلال العطل، حسب الوجهة والتوافر." },
    ],
    finalTitle: "خطوتك التالية تبدأ بسؤال.",
    finalLead: "أخبرنا باللغة التي تريدها، أو زورنا في حي النبلاء بالمسيلة.",
    visit: "زورونا في المدرسة",
  },
  en: {
    back: "Back to courses",
    approachEyebrow: "How it works",
    approachTitle: "Start with what you want to do in the language.",
    steps: [
      { number: "01", title: "Share your goal", body: "Tell us the situation you want to prepare for and your current level so we can help you find a starting point." },
      { number: "02", title: "Put it to use", body: "Join conversations, presentations and activities that make language a tool for expressing ideas and working with others." },
      { number: "03", title: "Explore what follows", body: "Ask about opportunities to learn in a country where the language is spoken during school breaks, subject to destination and availability." },
    ],
    finalTitle: "Your next step starts with a question.",
    finalLead: "Tell us which language interests you, or visit us in Hay Ennobalaa, M'Sila.",
    visit: "Visit the school",
  },
  fr: {
    back: "Retour aux cours",
    approachEyebrow: "Comment commencer ?",
    approachTitle: "Commencez par ce que vous voulez faire avec la langue.",
    steps: [
      { number: "01", title: "Parlez de votre objectif", body: "Dites-nous quelle situation vous voulez préparer et quel est votre niveau actuel. Nous vous aiderons à trouver un point de départ." },
      { number: "02", title: "Mettez-la en pratique", body: "Participez à des échanges, des présentations et des activités pour exprimer vos idées et travailler avec les autres." },
      { number: "03", title: "Découvrez la suite", body: "Renseignez-vous sur les possibilités d'apprendre dans un pays où la langue est parlée pendant les vacances, selon la destination et les disponibilités." },
    ],
    finalTitle: "Votre prochaine étape commence par une question.",
    finalLead: "Dites-nous quelle langue vous intéresse, ou venez nous voir au quartier Ennobalaa, à M'Sila.",
    visit: "Visiter l'école",
  },
} as const;

const courses = {
  english: {
    language: "English",
    image: "/voxbridge/course-english-studio-v1.png",
    ar: {
      title: "الإنجليزية",
      teaser: "للمحادثة، عرض أفكارك، والمواقف التي تنتظرك.",
      heroTitle: "الإنجليزية لموقفك القادم.",
      heroLead: "ابدأ من مستواك وهدفك. تدرب على التواصل والتعبير عن أفكارك داخل القسم، واسألنا عن فرص مواصلة التعلّم خلال العطل.",
      ask: "اسأل عن دورة الإنجليزية",
    },
    en: {
      title: "English",
      teaser: "For conversations, sharing your ideas and the moments ahead.",
      heroTitle: "English for your next moment.",
      heroLead: "Start from your level and goal. Practice communication and expressing your ideas in class, and ask about opportunities to continue learning during breaks.",
      ask: "Ask about English",
    },
    fr: {
      title: "Anglais",
      teaser: "Pour échanger, exprimer vos idées et préparer la suite.",
      heroTitle: "L'anglais pour votre prochaine étape.",
      heroLead: "Commencez à votre niveau, selon votre objectif. Pratiquez la communication et l'expression de vos idées en cours, et renseignez-vous sur les possibilités de poursuivre pendant les vacances.",
      ask: "Se renseigner sur l'anglais",
    },
  },
  french: {
    language: "French",
    image: "/voxbridge/course-french-studio-v1.png",
    ar: {
      title: "الفرنسية",
      teaser: "من أول حوار إلى التعبير عن فكرتك بوضوح.",
      heroTitle: "الفرنسية لموقفك القادم.",
      heroLead: "ابدأ من مستواك وهدفك. تدرب على التواصل والتعبير عن أفكارك داخل القسم، واسألنا عن فرص مواصلة التعلّم خلال العطل.",
      ask: "اسأل عن دورة الفرنسية",
    },
    en: {
      title: "French",
      teaser: "From your first conversation to expressing an idea clearly.",
      heroTitle: "French for your next moment.",
      heroLead: "Start from your level and goal. Practice communication and expressing your ideas in class, and ask about opportunities to continue learning during breaks.",
      ask: "Ask about French",
    },
    fr: {
      title: "Français",
      teaser: "Du premier échange à l'expression claire de vos idées.",
      heroTitle: "Le français pour votre prochaine étape.",
      heroLead: "Commencez à votre niveau, selon votre objectif. Pratiquez la communication et l'expression de vos idées en cours, et renseignez-vous sur les possibilités de poursuivre pendant les vacances.",
      ask: "Se renseigner sur le français",
    },
  },
} as const;

export function isCourseSlug(value: string): value is CourseSlug {
  return courseSlugs.some((slug) => slug === value);
}

export function courseFor(slug: CourseSlug, locale: string) {
  const course = courses[slug];
  const language = locale === "ar" || locale === "fr" ? locale : "en";
  return { slug, language: course.language, image: course.image, ...course[language as Locale] };
}

export function courseSectionFor(locale: string) {
  return courseSectionCopy[locale === "ar" || locale === "fr" ? locale : "en"];
}

export function coursePageFor(locale: string) {
  return coursePageCopy[locale === "ar" || locale === "fr" ? locale : "en"];
}
