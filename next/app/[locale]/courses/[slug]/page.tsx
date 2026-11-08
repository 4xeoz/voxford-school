import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomePageWrapper from "@/components/layout/HomePageWrapper";
import { getDictionary } from "@/dictionaries";
import { i18n, type Locale } from "@/i18n.config";
import { MAPS_DIRECTIONS } from "@/lib/contact";
import { courseFor, coursePageFor, courseSlugs, isCourseSlug } from "@/lib/course-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return i18n.locales.flatMap((locale) => courseSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isCourseSlug(slug)) return { title: "Course not found" };
  const course = courseFor(slug, locale);
  return {
    title: `${course.title} | Voxbridge Language School`,
    description: course.heroLead,
    openGraph: {
      title: course.heroTitle,
      description: course.heroLead,
      url: `${SITE_URL}/${locale}/courses/${slug}`,
      images: [{ url: `${SITE_URL}${course.image}`, width: 1122, height: 1402, alt: course.title }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/courses/${slug}`,
      languages: Object.fromEntries(i18n.locales.map((language) => [language, `${SITE_URL}/${language}/courses/${slug}`])),
    },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isCourseSlug(slug)) notFound();
  const dict = await getDictionary(locale as Locale);
  const course = courseFor(slug, locale);
  const page = coursePageFor(locale);
  const isAr = locale === "ar";

  return <HomePageWrapper locale={locale} dict={dict}>
    <main className="bg-[#fffdfa] text-[#242020]" dir={isAr ? "rtl" : "ltr"}>
      <section className="px-3 pb-20 pt-[104px] sm:px-5 sm:pt-[112px] lg:px-7 lg:pb-28">
        <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[2rem] bg-[#b7190d] text-white shadow-[0_24px_70px_rgba(82,17,8,.14)] sm:rounded-[2.5rem] lg:min-h-[650px] lg:grid-cols-2">
          <div className="flex flex-col items-start justify-center px-7 pb-14 pt-12 sm:px-12 lg:px-[clamp(3rem,6vw,6.5rem)] lg:py-20">
            <Link href={`/${locale}#courses`} className="text-sm font-bold text-white/80 transition hover:text-white">{isAr ? "→" : "←"} {page.back}</Link>
            <p className="mt-12 rounded-full border border-white/35 px-4 py-2 text-sm font-black sm:mt-16">{course.title}</p>
            <h1 className="mt-6 max-w-[11ch] text-[clamp(3rem,5vw,6rem)] font-black leading-[1.07] [text-wrap:balance]">{course.heroTitle}</h1>
            <p className="mt-7 max-w-[35rem] text-lg font-medium leading-relaxed text-white/90">{course.heroLead}</p>
            <Link href={`/${locale}/contact?interest=${course.language}`} className="mt-9 inline-flex min-h-14 items-center gap-4 rounded-full bg-[#fff7e9] px-7 py-3 font-black text-[#a6170d] transition hover:-translate-y-1 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{course.ask}<span aria-hidden>↗</span></Link>
          </div>
          <div className="relative min-h-[400px] overflow-hidden bg-[#a91008] sm:min-h-[560px] lg:min-h-full">
            <Image src={course.image} alt="Illustrative Voxbridge studio portrait with a sculpted ivory ribbon" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[center_46%]" />
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:pb-32">
        <div className="mx-auto max-w-[1240px]">
          <p className="open-eyebrow">{page.approachEyebrow}</p>
          <h2 className="open-heading mt-4 max-w-[15ch]">{page.approachTitle}</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {page.steps.map((step) => <div key={step.number} className="relative min-h-[245px] overflow-hidden rounded-[1.7rem] border border-[#eadfd9] bg-white p-7 shadow-[0_18px_45px_rgba(42,14,8,.05)]">
              <span className="text-sm font-black text-[#b6190e]">{step.number} / 03</span>
              <h3 className="mt-12 text-2xl font-black text-[#9f180e]">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-[#5d5554]">{step.body}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#f4eee9] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div><h2 className="open-heading max-w-[13ch]">{page.finalTitle}</h2><p className="mt-5 max-w-[37rem] text-lg text-[#5d5554]">{page.finalLead}</p></div>
          <div className="flex flex-wrap gap-3"><Link href={`/${locale}/contact?interest=${course.language}`} className="inline-flex min-h-13 items-center gap-3 rounded-full bg-[#b7190d] px-6 py-3 font-black text-white transition hover:bg-[#911207]">{course.ask}<span aria-hidden>↗</span></Link><a href={MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-13 items-center gap-3 rounded-full border border-[#b7190d] px-6 py-3 font-black text-[#a8170c] transition hover:bg-white">{page.visit}<span aria-hidden>↗</span></a></div>
        </div>
      </section>
    </main>
  </HomePageWrapper>;
}
