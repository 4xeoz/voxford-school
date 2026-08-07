import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import HomePageWrapper from "@/components/layout/HomePageWrapper";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nopeca.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const titles: Record<string, string> = {
    en: "FAQ — UK Study from Algeria: Visas, Costs & Admissions | Nopeca",
    fr: "FAQ — Études au Royaume-Uni depuis l'Algérie : Visa, Coûts & Admissions | Nopeca",
    ar: "الأسئلة الشائعة — الدراسة في المملكة المتحدة من الجزائر: التأشيرة والتكاليف والقبول | نوبيكا",
  };

  const descriptions: Record<string, string> = {
    en: "Answers to the most common questions from Algerian students about studying in the UK — visa requirements, tuition costs, scholarships, IELTS, and the application process.",
    fr: "Réponses aux questions les plus fréquentes des étudiants algériens sur les études au Royaume-Uni — exigences de visa, frais de scolarité, bourses, IELTS et processus de candidature.",
    ar: "إجابات على الأسئلة الأكثر شيوعاً من الطلاب الجزائريين حول الدراسة في المملكة المتحدة — متطلبات التأشيرة، تكاليف الدراسة، المنح الدراسية، IELTS، وعملية التقديم.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${SITE_URL}/${locale}/faq`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/faq`,
      languages: {
        en: `${SITE_URL}/en/faq`,
        fr: `${SITE_URL}/fr/faq`,
        ar: `${SITE_URL}/ar/faq`,
      },
    },
  };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const isAr = locale === "ar";

  const faqs = [
    { q: dict.faq.q1, a: dict.faq.a1 },
    { q: dict.faq.q2, a: dict.faq.a2 },
    { q: dict.faq.q3, a: dict.faq.a3 },
    { q: dict.faq.q4, a: dict.faq.a4 },
    { q: dict.faq.q5, a: dict.faq.a5 },
    { q: dict.faq.q6, a: dict.faq.a6 },
    { q: dict.faq.q7, a: dict.faq.a7 },
    { q: dict.faq.q8, a: dict.faq.a8 },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isAr ? "الرئيسية" : locale === "fr" ? "Accueil" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.faq.badge,
        item: `${SITE_URL}/${locale}/faq`,
      },
    ],
  };

  return (
    <HomePageWrapper locale={locale} dict={dict}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full bg-[--color-brand-primary]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[--color-brand-primary]">
            {dict.faq.badge}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-[--color-brand-primary] sm:text-4xl lg:text-5xl">
            {dict.faq.pageTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[--color-text-primary]/60 sm:text-lg">
            {dict.faq.pageSubtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="divide-y divide-[--color-border-soft]">
          {faqs.map(({ q, a }, i) => (
            <details
              key={i}
              className="group py-6 open:pb-6"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-left">
                <h2 className="text-base font-semibold leading-snug text-[--color-brand-primary] sm:text-lg">
                  {q}
                </h2>
                <span className="mt-0.5 shrink-0 rounded-full border border-[--color-border-soft] p-1 text-[--color-brand-primary] transition-transform group-open:rotate-45">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-base leading-relaxed text-[--color-text-primary]/70">
                {a}
              </p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[--color-brand-primary] p-8 text-center sm:p-12">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            {locale === "ar"
              ? "هل لديك سؤال آخر؟"
              : locale === "fr"
              ? "Vous avez une autre question ?"
              : "Still have questions?"}
          </h3>
          <p className="mt-3 text-white/75">
            {locale === "ar"
              ? "فريقنا جاهز للإجابة على أسئلتك مجاناً."
              : locale === "fr"
              ? "Notre équipe est prête à répondre à vos questions gratuitement."
              : "Our team is ready to answer your questions for free."}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="mt-6 inline-block rounded-full bg-[--color-brand-secondary] px-8 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg sm:px-10 sm:py-4"
          >
            {dict.nav.applyNow}
          </Link>
        </div>
      </section>
    </HomePageWrapper>
  );
}
