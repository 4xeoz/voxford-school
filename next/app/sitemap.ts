import type { MetadataRoute } from 'next';
import { i18n } from '@/i18n.config';
import { getAllPublishedSlugs } from '@/actions/blog';
import { getOpenJobSlugs } from '@/actions/careers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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

  // Careers listing pages
  allLocales.forEach((locale) => {
    routes.push({
      url: `${SITE_URL}/${locale}/careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          allLocales.map((l) => [l, `${SITE_URL}/${l}/careers`])
        ),
      },
    });
  });

  // Individual job posts — open roles only, so closed ones drop out of search
  let jobs: { slug: string; updatedAt: Date }[] = [];
  try {
    jobs = await getOpenJobSlugs();
  } catch {
    // DB not available during build — skip jobs in sitemap
  }
  jobs.forEach((job) => {
    allLocales.forEach((locale) => {
      routes.push({
        url: `${SITE_URL}/${locale}/careers/${job.slug}`,
        lastModified: job.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            allLocales.map((l) => [l, `${SITE_URL}/${l}/careers/${job.slug}`])
          ),
        },
      });
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
