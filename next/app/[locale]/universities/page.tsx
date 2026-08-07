import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import type { Metadata } from "next";
import UniversitiesPageClient from "@/components/sections/UniversitiesPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nopeca.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const titles: Record<string, string> = {
    en: "UK Universities for Algerian Students — Compare Fees & Programs | Nopeca",
    fr: "Universités Britanniques pour Étudiants Algériens — Comparer les Frais & Programmes | Nopeca",
    ar: "الجامعات البريطانية للطلاب الجزائريين — مقارنة الرسوم والبرامج | نوبيكا",
  };

  const descriptions: Record<string, string> = {
    en: "Explore 200+ UK universities available to Algerian students. Compare tuition fees, programs, and entry requirements. Get free expert guidance from Nopeca advisors.",
    fr: "Explorez 200+ universités britanniques accessibles aux étudiants algériens. Comparez les frais de scolarité, les programmes et les conditions d'admission. Conseil expert gratuit.",
    ar: "استكشف أكثر من 200 جامعة بريطانية متاحة للطلاب الجزائريين. قارن الرسوم الدراسية والبرامج ومتطلبات القبول. إرشاد خبير مجاني من مستشاري نوبيكا.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    keywords: locale === "fr"
      ? "universités UK Algérie, universités britanniques étudiants algériens, frais scolarité UK, Oxford Algérie, Cambridge Algérie, UCL Algérie"
      : locale === "ar"
      ? "جامعات UK الجزائر، جامعات بريطانية طلاب جزائريون، رسوم دراسية UK، أكسفورد الجزائر، كامبريدج الجزائر"
      : "UK universities Algeria, British universities Algerian students, UK tuition fees Algeria, Oxford Algeria, Cambridge Algeria, UCL Algeria, best UK universities international students",
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${SITE_URL}/${locale}/universities`,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/universities`,
      languages: {
        en: `${SITE_URL}/en/universities`,
        fr: `${SITE_URL}/fr/universities`,
        ar: `${SITE_URL}/ar/universities`,
      },
    },
  };
}

export default async function UniversitiesPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <UniversitiesPageClient dict={dict} locale={locale} />;
}
