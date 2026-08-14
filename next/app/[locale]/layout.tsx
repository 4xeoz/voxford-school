import type { Metadata } from 'next';
import { i18n, type Locale } from '@/i18n.config';
import { getDictionary } from '@/dictionaries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
    // absolute: seo.title already carries the brand, so skip the root
    // layout's "%s | Voxbridge" template and avoid doubling it up.
    title: { absolute: dict.seo.title },
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

// lang and dir now live on <html> in the root layout, so this is a pass-through.
export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
