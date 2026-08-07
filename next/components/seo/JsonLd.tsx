import type { Dictionary } from "@/dictionaries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nopeca.com";

interface JsonLdProps {
  locale: string;
  dict: Dictionary;
}

export default function JsonLd({ locale, dict }: JsonLdProps) {
  const isAr = locale === "ar";
  const isFr = locale === "fr";

  const organization = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    name: "Nopeca",
    alternateName: ["Advanced Pathways Global", "نوبيكا"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/singl_logo_colord_white_background@4x.png`,
      width: 2049,
      height: 2049,
    },
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    description: dict.seo.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Boumerdes",
      addressLocality: "Boumerdes",
      addressRegion: "Boumerdes Province",
      addressCountry: "DZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "36.7595",
      longitude: "3.4671",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+213-560-409-193",
        contactType: "customer service",
        areaServed: "DZ",
        availableLanguage: ["English", "French", "Arabic"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+44-7879-003-218",
        contactType: "customer service",
        contactOption: "https://wa.me/447879003218",
        areaServed: "GB",
        availableLanguage: ["English", "French", "Arabic"],
      },
    ],
    email: "contact@nopeca.com",
    sameAs: [
      "https://instagram.com/nopeca",
      "https://linkedin.com/company/nopeca",
    ],
    areaServed: [
      {
        "@type": "Country",
        name: "Algeria",
      },
    ],
    serviceType: [
      "Study Abroad Consulting",
      "University Admissions",
      "UK Student Visa Assistance",
      "Scholarship Guidance",
    ],
    priceRange: "Free Consultation",
    openingHours: "Mo-Sa 09:00-18:00",
    hasMap: "https://maps.google.com/?q=Advanced+Pathways+Global+Boumerdes",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nopeca",
    url: SITE_URL,
    inLanguage: isAr ? "ar-DZ" : isFr ? "fr-DZ" : "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}/universities`,
      "query-input": "required name=search_term_string",
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { q: dict.faq.q1, a: dict.faq.a1 },
      { q: dict.faq.q2, a: dict.faq.a2 },
      { q: dict.faq.q3, a: dict.faq.a3 },
      { q: dict.faq.q4, a: dict.faq.a4 },
      { q: dict.faq.q5, a: dict.faq.a5 },
      { q: dict.faq.q6, a: dict.faq.a6 },
      { q: dict.faq.q7, a: dict.faq.a7 },
      { q: dict.faq.q8, a: dict.faq.a8 },
    ].map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isAr ? "الرئيسية" : isFr ? "Accueil" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
