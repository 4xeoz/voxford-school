import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";
import type { Locale } from "@/i18n.config";

type Props = { params: Promise<{ locale: string }> };

const copy: Record<Locale, { title: string; intro: string; collected: string; use: string; retention: string; permissions: string; analytics: string; contact: string; back: string }> = {
  en: {
    title: "Website privacy",
    intro: "Voxbridge records visits to understand which pages people use and how the site works on different phones.",
    collected: "For a page view, we record the page and time, public IP address, approximate country, region and city derived from that IP when available, device category and reported model, screen and viewport sizes in CSS pixels, operating system and browser names and versions when supplied, and the referring website origin. We also count clicks on selected contact links.",
    use: "School administrators can view this information in the private dashboard to improve the site and measure interest. Exact phone models and software versions are often unavailable.",
    retention: "A daily job clears IP addresses and other detailed visit fields about 30 days after each visit. The page, event type and time remain for traffic totals.",
    permissions: "We do not request access to your camera, microphone, contacts or precise GPS location for this tracking.",
    analytics: "The website also loads Google Analytics, which is separate from the private dashboard described above.",
    contact: "Questions about your information? Email us at",
    back: "Back to Voxbridge",
  },
  fr: {
    title: "Confidentialité du site",
    intro: "Voxbridge enregistre les visites pour comprendre les pages consultées et améliorer le site sur différents téléphones.",
    collected: "Lors d'une visite, nous enregistrons la page et l'heure, l'adresse IP publique, le pays, la région et la ville approximatifs déduits de l'IP lorsqu'ils sont disponibles, la catégorie et le modèle déclaré de l'appareil, les dimensions de l'écran et de la fenêtre en pixels CSS, le système et le navigateur avec leurs versions lorsqu'elles sont fournies, ainsi que l'origine du site référent. Nous comptons aussi certains clics de contact.",
    use: "Les administrateurs de l'école consultent ces informations dans un tableau de bord privé pour améliorer le site et mesurer l'intérêt. Le modèle exact du téléphone et les versions logicielles sont souvent indisponibles.",
    retention: "Une tâche quotidienne efface les adresses IP et les autres détails de visite environ 30 jours après la visite. La page, le type d'événement et l'heure restent pour les statistiques de fréquentation.",
    permissions: "Ce suivi ne demande pas l'accès à la caméra, au microphone, aux contacts ni à la position GPS précise.",
    analytics: "Le site charge aussi Google Analytics, séparément du tableau de bord privé décrit ici.",
    contact: "Une question sur vos données ? Écrivez-nous à",
    back: "Retour à Voxbridge",
  },
  ar: {
    title: "خصوصية الموقع",
    intro: "تسجّل فوكس بريدج زيارات الموقع لمعرفة الصفحات المستخدمة وتحسين عرضه على الهواتف المختلفة.",
    collected: "عند زيارة صفحة، نسجّل الصفحة ووقت الزيارة، وعنوان IP العام، والبلد والمنطقة والمدينة التقريبية المستنتجة من العنوان عند توفرها، وفئة الجهاز وطرازه المعلن، وأبعاد الشاشة ونافذة المتصفح ببكسلات CSS، واسم نظام التشغيل والمتصفح وإصداريهما عند توفرهما، ومصدر الزيارة على مستوى الموقع. ونحصي أيضًا النقرات على بعض وسائل التواصل.",
    use: "يمكن لمسؤولي المدرسة الاطلاع على هذه المعلومات في لوحة خاصة لتحسين الموقع وقياس الاهتمام. قد لا يوفّر المتصفح طراز الهاتف أو الإصدار الدقيق.",
    retention: "تحذف مهمة يومية عنوان IP وتفاصيل الزيارة الأخرى بعد نحو 30 يومًا. وتبقى الصفحة ونوع الحدث ووقته لإحصاءات الزيارات.",
    permissions: "لا نطلب إذن الوصول إلى الكاميرا أو الميكروفون أو جهات الاتصال أو موقع GPS الدقيق لهذا التتبع.",
    analytics: "يستخدم الموقع أيضًا Google Analytics، وهو منفصل عن لوحة الإحصاءات الخاصة الموضحة هنا.",
    contact: "للاستفسار عن معلوماتك، راسلنا على",
    back: "العودة إلى فوكس بريدج",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const language: Locale = locale === "ar" || locale === "fr" ? locale : "en";
  return { title: `${copy[language].title} | Voxbridge`, robots: { index: false, follow: false } };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const language: Locale = locale === "ar" || locale === "fr" ? locale : "en";
  const t = copy[language];
  return (
    <main className="min-h-screen bg-[#FCFAF8] px-5 py-12 text-[#292522]" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-2xl">
        <Link href={`/${language}`} className="text-sm font-bold text-[#BC0000] hover:underline">← {t.back}</Link>
        <h1 className="mt-8 text-3xl font-black">{t.title}</h1>
        <div className="mt-6 space-y-5 text-base leading-8">
          <p>{t.intro}</p>
          <p>{t.collected}</p>
          <p>{t.use}</p>
          <p>{t.retention}</p>
          <p>{t.permissions}</p>
          <p>{t.analytics}</p>
          <p>{t.contact} <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-[#BC0000] underline" dir="ltr">{CONTACT_EMAIL}</a>.</p>
        </div>
      </div>
    </main>
  );
}
