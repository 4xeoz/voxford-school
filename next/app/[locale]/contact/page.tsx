import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import type { Metadata } from "next";
import ContactPageClient from "@/components/sections/ContactPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nopeca.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Free Consultation — Study in UK from Algeria | Nopeca",
    fr: "Consultation Gratuite — Étudier au Royaume-Uni depuis l'Algérie | Nopeca",
    ar: "استشارة مجانية — الدراسة في المملكة المتحدة من الجزائر | نوبيكا",
  };

  const descriptions: Record<string, string> = {
    en: "Book your free consultation with Nopeca. Our experts guide Algerian students through UK university admissions, student visa, and 1-to-1 arrival support. Contact us today.",
    fr: "Réservez votre consultation gratuite avec Nopeca. Nos experts accompagnent les étudiants algériens dans les admissions universitaires UK, le visa étudiant et l'accompagnement à l'arrivée.",
    ar: "احجز استشارتك المجانية مع نوبيكا. خبراؤنا يرشدون الطلاب الجزائريين عبر القبول في الجامعات البريطانية، تأشيرة الطالب، والدعم عند الوصول.",
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
