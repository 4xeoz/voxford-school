import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import HomePageWrapper from "@/components/layout/HomePageWrapper";
import { getCareersLabels } from "@/lib/careers-i18n";
import { getJobBySlug } from "@/actions/careers";
import ApplyClient from "./apply-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Apply | Voxbridge Careers",
  robots: { index: false, follow: false },
};

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const labels = getCareersLabels(locale);

  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const expired = !!job.closesAt && new Date(job.closesAt) < new Date();
  if (!job.isActive || expired) redirect(`/${locale}/careers/${slug}`);

  const dict = await getDictionary(locale as Locale);

  return (
    <HomePageWrapper locale={locale} dict={dict}>
      <section className="mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <Link
          href={`/${locale}/careers/${slug}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-soft/50 transition hover:text-brand"
        >
          <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {job.title}
        </Link>

        <h1 className="text-2xl font-bold text-brand sm:text-3xl">
          {labels.applyFor} {job.title}
        </h1>
        <p className="mt-2 mb-8 text-sm text-ink-soft/60">{labels.applyIntro}</p>

        <ApplyClient
          locale={locale}
          labels={labels}
          jobId={job.id}
          jobTitle={job.title}
          jobSlug={job.slug}
        />
      </section>
    </HomePageWrapper>
  );
}
