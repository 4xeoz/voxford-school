import type { Metadata } from 'next';
import { i18n, type Locale } from '@/i18n.config';
import { getDictionary } from '@/dictionaries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nopeca.com';

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return {
    title: dict.seo.title,
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    openGraph: {
      title: dict.seo.ogTitle,
      description: dict.seo.ogDescription,
      url: `${SITE_URL}/${locale}`,
      locale: locale === 'ar' ? 'ar_DZ' : locale === 'fr' ? 'fr_DZ' : 'en_DZ',
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        'en': `${SITE_URL}/en`,
        'fr': `${SITE_URL}/fr`,
        'ar': `${SITE_URL}/ar`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return (
    <div lang={locale} dir={isArabic ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}
