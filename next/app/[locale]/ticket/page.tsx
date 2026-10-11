import type { Metadata } from "next";
import { i18n, type Locale } from "@/i18n.config";
import TicketPageClient from "@/components/sections/TicketPageClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://voxbridge-school.vercel.app";

const titles: Record<Locale, string> = {
  ar: "فعّل تذكرتك | فوكس بريدج",
  fr: "Activez votre billet | Voxbridge",
  en: "Activate your ticket | Voxbridge",
};

const descriptions: Record<Locale, string> = {
  ar: "التسجيل مفتوح في فوكس بريدج. فعّل تذكرتك من البروشور ودعنا نساعدك على اختيار خطوتك التالية مع اللغة.",
  fr: "Les inscriptions sont ouvertes chez Voxbridge. Activez le billet de votre brochure et parlons de votre prochaine étape avec les langues.",
  en: "Enrollment is open at Voxbridge. Activate the ticket from your brochure and tell us where you want language to take you.",
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const language = i18n.locales.includes(locale as Locale)
    ? (locale as Locale)
    : i18n.defaultLocale;

  return {
    title: titles[language],
    description: descriptions[language],
    openGraph: {
      title: titles[language],
      description: descriptions[language],
      url: `${SITE_URL}/${language}/ticket`,
    },
    alternates: {
      canonical: `${SITE_URL}/${language}/ticket`,
      languages: {
        ar: `${SITE_URL}/ar/ticket`,
        fr: `${SITE_URL}/fr/ticket`,
        en: `${SITE_URL}/en/ticket`,
      },
    },
    // The brochure is the intended discovery path. The URL remains public.
    robots: { index: false, follow: false },
  };
}

export default async function TicketPage({ params }: Props) {
  const { locale } = await params;
  const language = i18n.locales.includes(locale as Locale)
    ? (locale as Locale)
    : i18n.defaultLocale;

  return <TicketPageClient locale={language} />;
}
