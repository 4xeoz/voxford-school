import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import type { Metadata } from "next";
import ContactPageClient from "@/components/sections/ContactPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Pre-register | Voxford Language School",
    fr: "Pré-inscription | Voxford, école de langues",
    ar: "التسجيل المسبق | مدرسة فوكسفورد للغات",
  };

  const descriptions: Record<string, string> = {
    en: "Pre-register for Voxford Language School in M'Sila, Algeria. English, French, Spanish, German and more — be first to enrol when we open.",
    fr: "Pré-inscrivez-vous à l'école de langues Voxford à M'Sila, Algérie. Anglais, espagnol, allemand et plus — soyez prioritaire à l'ouverture.",
    ar: "سجّل مسبقاً في مدرسة فوكسفورد للغات بالمسيلة، الجزائر. الإنجليزية والفرنسية والإسبانية والألمانية وغيرها — كن أول المسجّلين عند الافتتاح.",
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

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <ContactPageClient dict={dict} locale={locale} />;
}
