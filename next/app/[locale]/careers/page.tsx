import type { Metadata } from "next";
import Link from "next/link";
import { getOpenJobs } from "@/actions/careers";
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import HomePageWrapper from "@/components/layout/HomePageWrapper";
import { getCareersLabels, employmentLabel } from "@/lib/careers-i18n";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Careers — Work at Voxbridge Language School | Voxbridge",
    fr: "Carrières — Travailler chez Voxbridge | Voxbridge",
    ar: "الوظائف — اعمل في مدرسة فوكسبريدج للغات | فوكسبريدج",
  };
  const descriptions: Record<string, string> = {
    en: "Open positions at Voxbridge Language School in M'Sila, Algeria. Teaching and support roles — apply online with your CV.",
    fr: "Postes ouverts à l'école de langues Voxbridge à M'Sila, Algérie. Enseignement et encadrement — postulez en ligne avec votre CV.",
    ar: "الوظائف الشاغرة في مدرسة فوكسبريدج للغات بالمسيلة، الجزائر. مناصب تدريس ودعم — قدّم ترشحك مع سيرتك الذاتية.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${SITE_URL}/${locale}/careers`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/careers`,
      languages: {
        en: `${SITE_URL}/en/careers`,
        fr: `${SITE_URL}/fr/careers`,
        ar: `${SITE_URL}/ar/careers`,
      },
    },
  };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const labels = getCareersLabels(locale);
  const jobs = await getOpenJobs();

  return (
    <HomePageWrapper locale={locale} dict={dict}>
      <section className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            {labels.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-brand sm:text-4xl lg:text-5xl">
            {labels.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft/60 sm:text-lg">
            {labels.subtitle}
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline py-20">
            <svg className="mb-4 h-12 w-12 text-ink-soft/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            <p className="text-base font-medium text-ink-soft/40">{labels.noJobs}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/${locale}/careers/${job.slug}`}
                className="group flex flex-wrap items-center gap-4 rounded-2xl border border-hairline bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                      {employmentLabel(job.employmentType, locale)}
                    </span>
                    {job.department && (
                      <span className="rounded-full bg-ink-soft/5 px-2.5 py-0.5 text-xs font-medium text-ink-soft/60">
                        {job.department}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-brand">{job.title}</h2>

                  <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft/55">
                    <span className="inline-flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {job.location}
                    </span>
                    {job.salaryRange && <span>{job.salaryRange}</span>}
                    {job.closesAt && (
                      <span>
                        {labels.closes}{" "}
                        {new Date(job.closesAt).toLocaleDateString(
                          locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                    )}
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-ink-soft transition group-hover:gap-3">
                  {labels.viewJob}
                  <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </HomePageWrapper>
  );
}
