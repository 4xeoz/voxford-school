import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug } from "@/actions/careers";
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import HomePageWrapper from "@/components/layout/HomePageWrapper";
import { getCareersLabels, employmentLabel } from "@/lib/careers-i18n";
import { CAREERS_EMAIL } from "@/lib/contact";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) return { title: "Position not found | Voxbridge" };

  const description = job.description.slice(0, 155).replace(/\s+/g, " ").trim();

  return {
    title: `${job.title} — ${job.location} | Voxbridge`,
    description,
    openGraph: {
      title: `${job.title} — ${job.location} | Voxbridge`,
      description,
      url: `${SITE_URL}/${locale}/careers/${slug}`,
      type: "article",
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/careers/${slug}`,
      languages: {
        en: `${SITE_URL}/en/careers/${slug}`,
        fr: `${SITE_URL}/fr/careers/${slug}`,
        ar: `${SITE_URL}/ar/careers/${slug}`,
      },
    },
  };
}

/** Blank-line-separated paragraphs, matching how the admin form describes it. */
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className="mb-4 whitespace-pre-line leading-relaxed">
            {p}
          </p>
        ))}
    </>
  );
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const labels = getCareersLabels(locale);

  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const expired = !!job.closesAt && new Date(job.closesAt) < new Date();
  const open = job.isActive && !expired;

  const dateLocale =
    locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB";

  // Prefilled so the candidate doesn't have to guess what we need, and so the
  // subject line is greppable in the inbox.
  const mailto =
    `mailto:${CAREERS_EMAIL}` +
    `?subject=${encodeURIComponent(`${labels.emailSubject} — ${job.title}`)}` +
    `&body=${encodeURIComponent(labels.emailBody.replace("{title}", job.title))}`;

  const jobLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: new Date(job.createdAt).toISOString(),
    ...(job.closesAt
      ? { validThrough: new Date(job.closesAt).toISOString() }
      : {}),
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: "Voxbridge Language School",
      sameAs: SITE_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "DZ",
      },
    },
  };

  return (
    <HomePageWrapper locale={locale} dict={dict}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        {/* Back */}
        <Link
          href={`/${locale}/careers`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-soft/50 transition hover:text-brand"
        >
          <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {labels.backToJobs}
        </Link>

        {/* Header */}
        <header className="mb-8 border-b border-hairline pb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              {employmentLabel(job.employmentType, locale)}
            </span>
            {job.department && (
              <span className="rounded-full bg-ink-soft/5 px-3 py-1 text-xs font-medium text-ink-soft/60">
                {job.department}
              </span>
            )}
            {!open && (
              <span className="rounded-full bg-ink-soft/10 px-3 py-1 text-xs font-semibold text-ink-soft/50">
                {labels.closed}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight text-brand sm:text-4xl">
            {job.title}
          </h1>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="font-semibold text-ink-soft/50">{labels.location}</dt>
              <dd className="text-ink-soft">{job.location}</dd>
            </div>
            {job.salaryRange && (
              <div className="flex gap-2">
                <dt className="font-semibold text-ink-soft/50">{labels.salary}</dt>
                <dd className="text-ink-soft">{job.salaryRange}</dd>
              </div>
            )}
            {job.closesAt && (
              <div className="flex gap-2">
                <dt className="font-semibold text-ink-soft/50">{labels.closes}</dt>
                <dd className="text-ink-soft">
                  {new Date(job.closesAt).toLocaleDateString(dateLocale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="font-semibold text-ink-soft/50">{labels.posted}</dt>
              <dd className="text-ink-soft">
                {new Date(job.createdAt).toLocaleDateString(dateLocale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </header>

        {/* Body */}
        <section className="text-base text-ink-soft/80">
          <h2 className="mb-3 text-xl font-bold text-brand">{labels.aboutRole}</h2>
          <Paragraphs text={job.description} />

          {job.requirements && (
            <>
              <h2 className="mb-3 mt-8 text-xl font-bold text-brand">
                {labels.requirements}
              </h2>
              <Paragraphs text={job.requirements} />
            </>
          )}
        </section>

        {/* Apply CTA */}
        <div className="mt-12 rounded-2xl border-2 border-brand/40 bg-gradient-to-br from-brand/10 to-brand/5 p-6 text-center">
          {!open ? (
            <p className="text-sm font-medium text-ink-soft/60">
              {labels.closedNote}
            </p>
          ) : (
            <>
              <p className="text-base font-bold text-ink-soft">
                {labels.applyChoice}
              </p>
              <p className="mt-1 text-sm text-ink-soft/55">
                {labels.applyFor} {job.title}
              </p>

              <div className="mt-5 grid gap-3 text-start sm:grid-cols-2">
                {/* Online form */}
                <Link
                  href={`/${locale}/careers/${job.slug}/apply`}
                  className="group flex flex-col rounded-xl border-2 border-brand bg-brand p-4 text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                    {labels.applyOnline}
                  </span>
                  <span className="mt-1.5 text-xs leading-relaxed text-white/75">
                    {labels.applyOnlineHint}
                  </span>
                </Link>

                {/* Email */}
                <a
                  href={mailto}
                  className="group flex flex-col rounded-xl border-2 border-hairline bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand/40"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-ink-soft">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {labels.applyByEmail}
                  </span>
                  <span className="mt-1.5 text-xs leading-relaxed text-ink-soft/55">
                    {labels.applyByEmailHint}
                  </span>
                  <span className="mt-2 truncate text-xs font-semibold text-brand">
                    {CAREERS_EMAIL}
                  </span>
                </a>
              </div>
            </>
          )}
        </div>
      </article>
    </HomePageWrapper>
  );
}
