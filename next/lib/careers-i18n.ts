// Careers-page copy, in the three site locales.
//
// The blog pages keep their label maps inline, but careers spans several pages
// that share most of their wording, so it lives in one place instead. Job
// *content* itself is single-language — written once by the admin — while the
// surrounding UI translates.

export interface CareersLabels {
  eyebrow: string;
  title: string;
  subtitle: string;
  noJobs: string;
  viewJob: string;
  applyNow: string;
  backToJobs: string;
  aboutRole: string;
  requirements: string;
  salary: string;
  location: string;
  closes: string;
  posted: string;
  closed: string;
  closedNote: string;
  // Applicant details, collected on the apply form
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  city: string;
  selectWilaya: string;
  optional: string;
  // Apply
  applyFor: string;
  applyIntro: string;
  applyChoice: string;
  applyOnline: string;
  applyOnlineHint: string;
  applyByEmail: string;
  applyByEmailHint: string;
  emailSubject: string;
  emailBody: string;
  cv: string;
  cvHint: string;
  coverLetter: string;
  coverLetterHint: string;
  submitApplication: string;
  submitting: string;
  uploading: string;
  applied: string;
  appliedNote: string;
}

const en: CareersLabels = {
  eyebrow: "Careers",
  title: "Work with us",
  subtitle:
    "We're building a language school in M'Sila. If you teach, organise, or care about getting students where they want to go — we'd like to meet you.",
  noJobs: "No open positions right now. Check back soon.",
  viewJob: "View role",
  applyNow: "Apply now",
  backToJobs: "All positions",
  aboutRole: "About the role",
  requirements: "What we're looking for",
  salary: "Salary",
  location: "Location",
  closes: "Applications close",
  posted: "Posted",
  closed: "Applications closed",
  closedNote: "This position is no longer accepting applications.",
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  phone: "Phone",
  wilaya: "Wilaya",
  city: "City / commune",
  selectWilaya: "Select your wilaya",
  optional: "optional",
  applyFor: "Apply for",
  applyIntro:
    "No account needed — fill this in, attach your CV, and we'll take it from there.",
  applyChoice: "Two ways to apply",
  applyOnline: "Continue online",
  applyOnlineHint:
    "Fill in a short form and attach your CV. Takes about two minutes.",
  applyByEmail: "Apply by email",
  applyByEmailHint: "Prefer email? Send us your CV as an attachment.",
  emailSubject: "Application",
  emailBody: `Hello Voxbridge,

I would like to apply for the position of {title}.

Full name:
Phone:
Wilaya:

I have attached my CV to this email.

Thank you.`,
  cv: "Your CV",
  cvHint: "PDF or Word document, up to 5MB.",
  coverLetter: "Cover letter",
  coverLetterHint: "Tell us why this role, and what you'd bring to it.",
  submitApplication: "Submit application",
  submitting: "Submitting…",
  uploading: "Uploading your CV…",
  applied: "Application received",
  appliedNote:
    "We've got your CV and we'll be in touch by email or phone. Good luck.",
};

const fr: CareersLabels = {
  eyebrow: "Carrières",
  title: "Travailler avec nous",
  subtitle:
    "Nous construisons une école de langues à M'Sila. Si vous enseignez, organisez, ou tenez à faire avancer les étudiants — nous aimerions vous rencontrer.",
  noJobs: "Aucun poste ouvert pour le moment. Revenez bientôt.",
  viewJob: "Voir le poste",
  applyNow: "Postuler",
  backToJobs: "Tous les postes",
  aboutRole: "À propos du poste",
  requirements: "Ce que nous recherchons",
  salary: "Salaire",
  location: "Lieu",
  closes: "Clôture des candidatures",
  posted: "Publié",
  closed: "Candidatures closes",
  closedNote: "Ce poste n'accepte plus de candidatures.",
  email: "E-mail",
  firstName: "Prénom",
  lastName: "Nom",
  phone: "Téléphone",
  wilaya: "Wilaya",
  city: "Ville / commune",
  selectWilaya: "Sélectionnez votre wilaya",
  optional: "facultatif",
  applyFor: "Postuler pour",
  applyIntro:
    "Aucun compte requis — remplissez ce formulaire, joignez votre CV, et nous nous occupons du reste.",
  applyChoice: "Deux façons de postuler",
  applyOnline: "Continuer en ligne",
  applyOnlineHint:
    "Remplissez un court formulaire et joignez votre CV. Environ deux minutes.",
  applyByEmail: "Postuler par e-mail",
  applyByEmailHint: "Vous préférez l'e-mail ? Envoyez-nous votre CV en pièce jointe.",
  emailSubject: "Candidature",
  emailBody: `Bonjour Voxbridge,

Je souhaite postuler au poste de {title}.

Nom complet :
Téléphone :
Wilaya :

Vous trouverez mon CV en pièce jointe.

Cordialement.`,
  cv: "Votre CV",
  cvHint: "PDF ou document Word, jusqu'à 5 Mo.",
  coverLetter: "Lettre de motivation",
  coverLetterHint: "Dites-nous pourquoi ce poste, et ce que vous y apporteriez.",
  submitApplication: "Envoyer ma candidature",
  submitting: "Envoi…",
  uploading: "Téléversement de votre CV…",
  applied: "Candidature reçue",
  appliedNote:
    "Nous avons bien reçu votre CV. Nous vous recontacterons par e-mail ou par téléphone. Bonne chance.",
};

const ar: CareersLabels = {
  eyebrow: "الوظائف",
  title: "اعمل معنا",
  subtitle:
    "نحن نبني مدرسة لغات في المسيلة. إن كنت تُدرّس أو تنظّم أو يهمّك أن يصل الطلبة إلى ما يطمحون إليه — يسعدنا لقاؤك.",
  noJobs: "لا توجد وظائف شاغرة حاليًا. عد قريبًا.",
  viewJob: "عرض الوظيفة",
  applyNow: "قدّم الآن",
  backToJobs: "كل الوظائف",
  aboutRole: "عن الوظيفة",
  requirements: "ما نبحث عنه",
  salary: "الراتب",
  location: "المكان",
  closes: "آخر أجل للترشح",
  posted: "نُشر في",
  closed: "أُغلق باب الترشح",
  closedNote: "هذه الوظيفة لم تعد تقبل الترشيحات.",
  email: "البريد الإلكتروني",
  firstName: "الاسم",
  lastName: "اللقب",
  phone: "الهاتف",
  wilaya: "الولاية",
  city: "المدينة / البلدية",
  selectWilaya: "اختر ولايتك",
  optional: "اختياري",
  applyFor: "الترشح لوظيفة",
  applyIntro:
    "لا حاجة إلى حساب — املأ هذه الاستمارة وأرفق سيرتك الذاتية، ونتكفّل نحن بالباقي.",
  applyChoice: "طريقتان للترشح",
  applyOnline: "المتابعة عبر الموقع",
  applyOnlineHint: "املأ استمارة قصيرة وأرفق سيرتك الذاتية. تستغرق دقيقتين تقريبًا.",
  applyByEmail: "الترشح عبر البريد",
  applyByEmailHint: "تفضّل البريد الإلكتروني؟ أرسل لنا سيرتك الذاتية كمرفق.",
  emailSubject: "ترشح لوظيفة",
  emailBody: `السلام عليكم،

أرغب في الترشح لوظيفة {title}.

الاسم الكامل:
الهاتف:
الولاية:

تجدون سيرتي الذاتية مرفقة بهذا البريد.

شكرًا لكم.`,
  cv: "سيرتك الذاتية",
  cvHint: "ملف PDF أو Word، بحجم أقصاه 5 ميغابايت.",
  coverLetter: "رسالة التحفيز",
  coverLetterHint: "أخبرنا لماذا هذه الوظيفة، وما الذي ستضيفه إليها.",
  submitApplication: "إرسال الترشح",
  submitting: "جارٍ الإرسال…",
  uploading: "جارٍ رفع سيرتك الذاتية…",
  applied: "تم استلام ترشحك",
  appliedNote:
    "استلمنا سيرتك الذاتية وسنتواصل معك عبر البريد أو الهاتف. حظًا موفقًا.",
};

const LABELS: Record<string, CareersLabels> = { en, fr, ar };

export function getCareersLabels(locale: string): CareersLabels {
  return LABELS[locale] ?? en;
}

export const EMPLOYMENT_LABELS: Record<string, Record<string, string>> = {
  en: {
    FULL_TIME: "Full time",
    PART_TIME: "Part time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
  },
  fr: {
    FULL_TIME: "Temps plein",
    PART_TIME: "Temps partiel",
    CONTRACT: "Contrat",
    INTERNSHIP: "Stage",
  },
  ar: {
    FULL_TIME: "دوام كامل",
    PART_TIME: "دوام جزئي",
    CONTRACT: "عقد",
    INTERNSHIP: "تربص",
  },
};

export function employmentLabel(type: string, locale: string): string {
  return EMPLOYMENT_LABELS[locale]?.[type] ?? EMPLOYMENT_LABELS.en[type] ?? type;
}
