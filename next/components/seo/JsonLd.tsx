import type { Dictionary } from "@/dictionaries";
import { SHOW_PHONE_CONTACT } from "@/lib/contact";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
    name: "Voxbridge Language School",
    alternateName: ["Voxbridge", "مدرسة فوكسبريدج للغات"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/voxbridge/icon-detailed-red-on-whiteBackground-v2.png`,
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
      streetAddress: "M'Sila",
      addressLocality: "M'Sila",
      addressRegion: "M'Sila Province",
      addressCountry: "DZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "35.7058",
      longitude: "4.5419",
    },
    // Omitted entirely while contact numbers are hidden — structured data is
    // invisible on the page but Google surfaces it as a call button.
    ...(SHOW_PHONE_CONTACT
      ? {
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
        }
      : {}),
    email: "contact@voxbridge.com",
    sameAs: [
      "https://instagram.com/voxbridge",
      "https://linkedin.com/company/voxbridge",
    ],
    areaServed: [
      {
        "@type": "Country",
        name: "Algeria",
      },
    ],
    serviceType: [
      "Language Courses",
      "English Language Teaching",
      "French Language Teaching",
      "IELTS Preparation",
    ],
    priceRange: "Pre-registration open",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Voxbridge Language School",
    url: SITE_URL,
    inLanguage: isAr ? "ar-DZ" : isFr ? "fr-DZ" : "en",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
