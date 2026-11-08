import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomePageWrapper from "@/components/layout/HomePageWrapper";
import { getDictionary } from "@/dictionaries";
import { i18n, type Locale } from "@/i18n.config";
import { audienceFor, audienceIds, languagesForAudience } from "@/lib/audience-content";
import { audienceDetailCopy, audienceLanguageCopy } from "@/lib/course-content";
import { SITE_URL } from "@/lib/site-url";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return i18n.locales.flatMap((locale) => audienceIds.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const audience = audienceFor(slug, locale);
  if (!audience) return { title: "Pathway not found" };

  const url = `${SITE_URL}/${locale}/courses/audience/${slug}`;
  return {
    title: `${audience.heading} | Voxbridge Language School`,
    description: audience.description,
    openGraph: { title: audience.heading, description: audience.description, url },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(i18n.locales.map((language) => [language, `${SITE_URL}/${language}/courses/audience/${slug}`])),
    },
  };
}

export default async function AudienceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const audience = audienceFor(slug, locale);
  if (!audience) notFound();

  const dict = await getDictionary(locale as Locale);
  const copy = audienceDetailCopy[locale === "ar" || locale === "fr" ? locale : "en"];
  const languageCopy = audienceLanguageCopy[locale === "ar" || locale === "fr" ? locale : "en"];
  const languages = languagesForAudience(locale);
  const isAr = locale === "ar";

  return <HomePageWrapper locale={locale} dict={dict}>
    <main className="bg-[#fffdfa] text-[#242020]" dir={isAr ? "rtl" : "ltr"}>
      <section className="px-5 pb-20 pt-[112px] sm:px-8 sm:pt-[128px] lg:pb-28">
        <div className="mx-auto grid max-w-[1240px] items-stretch gap-5 lg:grid-cols-[1fr_.92fr]">
          <div className="rounded-[2rem] bg-[#b7190d] p-7 text-white shadow-[0_24px_65px_rgba(73,14,8,.16)] sm:rounded-[2.4rem] sm:p-11 lg:p-12">
            <Link href={`/${locale}#courses`} className="text-sm font-bold text-white/75 transition hover:text-white">{isAr ? "→" : "←"} {copy.back}</Link>
            <div className="mt-10 flex flex-wrap gap-2 sm:mt-14">
              <span dir={audience.ageRange ? "ltr" : undefined} className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm font-black">{audience.ageRange ?? audience.ageGroup}</span>
              <span className="rounded-full border border-white/35 px-4 py-2 text-sm font-bold">{audience.segment}</span>
            </div>
            <h1 className="mt-7 max-w-[15ch] text-[clamp(2.7rem,4.6vw,4.6rem)] font-black leading-[1.08] [text-wrap:balance]">{audience.heading}</h1>
            <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-white/85 sm:text-xl">{audience.description}</p>

            <div className="mt-10 border-t border-white/25 pt-7">
              <h2 className="text-xl font-black sm:text-2xl">{copy.languageTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75 sm:text-base">{copy.languageLead}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {languages.map((language) => language.available ? (
                  <Link key={language.slug} href={`/${locale}/courses/${language.slug}?audience=${audience.id}`} className="flex min-h-[68px] items-center justify-between gap-2 rounded-2xl bg-[#fff7e9] px-4 py-3 font-black text-[#a8170c] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    <span>{language.label}<span className="mt-1 block text-[11px] font-bold text-[#685651]">{languageCopy.available}</span></span><span aria-hidden className="text-lg">↗</span>
                  </Link>
                ) : (
                  <span key={language.slug} className="flex min-h-[68px] items-center justify-between gap-2 rounded-2xl border border-dashed border-white/35 px-4 py-3 font-bold text-white/85">
                    <span>{language.label}<span className="mt-1 block text-[11px]">{languageCopy.comingSoon}</span></span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#eadbd4] bg-[#b7190d] shadow-[0_24px_65px_rgba(73,14,8,.12)] sm:min-h-[600px] lg:min-h-full lg:rounded-[2.4rem]">
            <Image src={audience.image} alt="" fill priority sizes="(max-width: 1023px) 100vw, 46vw" className="object-cover object-[center_32%]" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#4f0804]/35 via-transparent to-[#4f0804]/10" />
          </div>
        </div>
      </section>
    </main>
  </HomePageWrapper>;
}
