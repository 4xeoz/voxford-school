import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import type { Metadata } from "next";
import ConnectPageClient from "@/components/sections/ConnectPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Contact Us | Voxbridge Language School",
    fr: "Contactez-nous | Voxbridge, école de langues",
    ar: "تواصل معنا | مدرسة فوكسبريدج للغات",
  };

  const descriptions: Record<string, string> = {
    en: "WhatsApp, call, get directions, or email Voxbridge Language School in M'Sila, Algeria.",
    fr: "WhatsApp, appel, itinéraire ou e-mail pour joindre l'école Voxbridge à M'Sila, Algérie.",
    ar: "واتساب، اتصال، الاتجاهات، أو البريد الإلكتروني للتواصل مع مدرسة فوكسبريدج بالمسيلة، الجزائر.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `${SITE_URL}/${locale}/connect`,
      languages: {
        en: `${SITE_URL}/en/connect`,
        fr: `${SITE_URL}/fr/connect`,
        ar: `${SITE_URL}/ar/connect`,
      },
    },
    // Social-traffic landing page — no need for it to rank or get previewed.
    robots: { index: false, follow: false },
  };
}

export default async function ConnectPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return <ConnectPageClient dict={dict} locale={locale} />;
}
