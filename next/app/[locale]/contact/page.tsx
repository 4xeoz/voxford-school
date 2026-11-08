import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import type { Metadata } from "next";
import OpenContactPage from "@/components/sections/OpenContactPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Contact & visit | Voxbridge Language School",
    fr: "Contact et visite | Voxbridge, école de langues",
    ar: "تواصل وزيارة | مدرسة فوكسبريدج للغات",
  };

  const descriptions: Record<string, string> = {
    en: "Visit Voxbridge Language School in M'Sila or ask us about English, French and study trips.",
    fr: "Visitez l'école de langues Voxbridge à M'Sila ou renseignez-vous sur l'anglais, le français et les séjours.",
    ar: "زر مدرسة فوكسبريدج للغات في المسيلة أو استفسر عن الإنجليزية والفرنسية ورحلات التعلّم.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${SITE_URL}/${locale}/contact`,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
      languages: {
        en: `${SITE_URL}/en/contact`,
        fr: `${SITE_URL}/fr/contact`,
        ar: `${SITE_URL}/ar/contact`,
      },
    },
  };
}

export default async function ContactPage({ params, searchParams }: Props & { searchParams: Promise<{ interest?: string }> }) {
  const { locale } = await params;
  const { interest } = await searchParams;
  const dict = await getDictionary(locale as Locale);
  return <OpenContactPage dict={dict} locale={locale} interest={interest} />;
}
