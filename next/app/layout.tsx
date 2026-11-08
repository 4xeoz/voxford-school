import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { i18n } from '@/i18n.config';
import { Toaster } from '@/components/ui/sonner';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import './globals.css';

// Set NEXT_PUBLIC_SITE_URL to the production domain — canonical URLs, OG tags
// and the sitemap all derive from it.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://voxbridge-school.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Voxbridge Language School | Open in M'Sila, Algeria",
    template: '%s | Voxbridge',
  },
  description:
    "Voxbridge Language School is open in M'Sila. Explore English and French, real communication, and learning experiences beyond the classroom.",
  keywords: [
    "language school M'Sila",
    'English courses Algeria',
    "French courses M'Sila",
    'learn English Algeria',
    "école de langues M'Sila",
    "cours d'anglais Algérie",
    'Voxbridge',
    "M'Sila",
    'مدرسة لغات المسيلة',
    'تعلم الإنجليزية الجزائر',
  ],
  authors: [{ name: 'Voxbridge Language School', url: SITE_URL }],
  creator: 'Voxbridge Language School',
  publisher: 'Voxbridge Language School',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Voxbridge Language School',
    locale: 'en_DZ',
    alternateLocale: ['fr_DZ', 'ar_DZ'],
    url: SITE_URL,
    title: 'Voxbridge Language School — Now Open in M\'Sila',
    description:
      "Visit Voxbridge in M'Sila. Learn English or French through communication and ask about study trips during school breaks.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Voxbridge Language School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voxbridge Language School',
    description:
      "Voxbridge Language School is open in M'Sila. Visit us or send an enquiry.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en': `${SITE_URL}/en`,
      'fr': `${SITE_URL}/fr`,
      'ar': `${SITE_URL}/ar`,
      'x-default': `${SITE_URL}/en`,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-google-verification-code',
  },
};

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Set by middleware — this layout sits above [locale] so it has no route param.
  const locale = (await headers()).get('x-locale') ?? i18n.defaultLocale;
  const isArabic = locale === 'ar';

  return (
    // dir is always ltr: the Arabic version keeps the same layout as EN/FR
    // rather than mirroring. lang still says 'ar' so screen readers and search
    // engines identify the language correctly.
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/voxbridge/icon-detailed-red-on-whiteBackground-v2.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Cairo matches the current approved Arabic campaign typography. */}
        {isArabic && (
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" />
        )}
      </head>
      <body className={isArabic ? 'font-arabic' : undefined}>
        <GoogleAnalytics />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
