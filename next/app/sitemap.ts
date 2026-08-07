import type { MetadataRoute } from 'next';
import { i18n } from '@/i18n.config';
import { getAllPublishedSlugs } from '@/actions/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nopeca.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allLocales = i18n.locales;

  // Home pages — include all locales (en, fr, ar)
  const routes: MetadataRoute.Sitemap = allLocales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        allLocales.map((l) => [l, `${SITE_URL}/${l}`])
      ),
    },
  }));

  // Universities pages
  allLocales.forEach((locale) => {
    routes.push({
      url: `${SITE_URL}/${locale}/universities`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          allLocales.map((l) => [l, `${SITE_URL}/${l}/universities`])
        ),
      },
    });
  });

  // FAQ pages
  allLocales.forEach((locale) => {
    routes.push({
      url: `${SITE_URL}/${locale}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          allLocales.map((l) => [l, `${SITE_URL}/${l}/faq`])
        ),
      },
    });
  });

  // Contact pages
  allLocales.forEach((locale) => {
    routes.push({
      url: `${SITE_URL}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          allLocales.map((l) => [l, `${SITE_URL}/${l}/contact`])
        ),
      },
    });
  });

  // Blog listing pages
  allLocales.forEach((locale) => {
    routes.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          allLocales.map((l) => [l, `${SITE_URL}/${l}/blog`])
        ),
      },
    });
  });

  // Individual blog posts
  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    posts = await getAllPublishedSlugs();
  } catch {
    // DB not available during build — skip blog posts in sitemap
  }
  posts.forEach((post) => {
    allLocales.forEach((locale) => {
      routes.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            allLocales.map((l) => [l, `${SITE_URL}/${l}/blog/${post.slug}`])
          ),
        },
      });
    });
  });

  return routes;
}
