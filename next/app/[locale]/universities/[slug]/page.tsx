import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/i18n.config";
import { getDictionary } from "@/dictionaries";
import { UK_UNIVERSITIES_DATA } from "@/lib/data/universities";
import UniversityDetailClient from "@/components/sections/universities/UniversityDetailClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nopeca.com";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return UK_UNIVERSITIES_DATA.map((uni) => ({ slug: uni.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const uni = UK_UNIVERSITIES_DATA.find((u) => u.slug === slug);
  if (!uni) return {};

  const title = `${uni.name} — Fees, Programs & Entry Requirements | Nopeca`;
  const description = `Study at ${uni.name} as an Algerian student. ${uni.shortDescription}. Tuition from £${Math.min(...uni.programs.map((p) => p.feeFrom)).toLocaleString()}/yr. Get free expert guidance from Nopeca.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [uni.image],
      url: `${SITE_URL}/${locale}/universities/${slug}`,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/universities/${slug}`,
    },
  };
}

export default async function UniversityPage({ params }: Props) {
  const { locale, slug } = await params;
  const uni = UK_UNIVERSITIES_DATA.find((u) => u.slug === slug);
  if (!uni) notFound();

  const dict = await getDictionary(locale as Locale);

  return <UniversityDetailClient university={uni} locale={locale} dict={dict} />;
}
