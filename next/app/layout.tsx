import type { Metadata } from 'next';
import { i18n } from '@/i18n.config';
import { Toaster } from '@/components/ui/sonner';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import './globals.css';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nopeca.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Study in UK from Algeria | University Admissions & Visa Support | Nopeca',
    template: '%s | Nopeca',
  },
  description:
    'Nopeca helps Algerian students study in top UK universities. Expert guidance on admissions, UK student visa, scholarships & arrival support. 500+ students placed. Based in Boumerdes.',
  keywords: [
    'study in UK from Algeria',
    'UK student visa Algeria',
    'UK universities for Algerian students',
    'scholarships for Algerian students',
    'étudier au Royaume-Uni depuis l\'Algérie',
    'visa étudiant UK Algérie',
    'study abroad Algeria',
    'Nopeca',
    'Boumerdes',
    'Oxford',
    'Cambridge',
    'UCL',
    'الدراسة في المملكة المتحدة من الجزائر',
    'تأشيرة طالب UK الجزائر',
  ],
  authors: [{ name: 'Nopeca', url: SITE_URL }],
  creator: 'Nopeca',
  publisher: 'Nopeca',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Nopeca',
    locale: 'en_DZ',
    alternateLocale: ['fr_DZ', 'ar_DZ'],
    url: SITE_URL,
    title: 'Study in the UK from Algeria | Nopeca — Your Gateway to British Universities',
    description:
      '500+ Algerian students placed at top UK universities. Expert support for admissions, UK student visa, flights & arrival. Based in Boumerdes. Free consultation.',
    images: [
      {
        url: 'https://nopeca.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nopeca — Study in the UK from Algeria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in UK from Algeria | Nopeca',
    description:
      '500+ Algerian students placed at top UK universities. Free expert guidance on admissions, visa, flights & arrival support.',
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

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/og-image.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <GoogleAnalytics />
        <LoadingOverlay />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
