import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/actions/blog";
import { getLocalizedPost } from "@/lib/blog";
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/i18n.config";
import HomePageWrapper from "@/components/layout/HomePageWrapper";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Blog — Language Learning Tips & Guides | Voxford",
    fr: "Blog — Conseils et guides pour apprendre les langues | Voxford",
    ar: "المدونة — نصائح وإرشادات لتعلّم اللغات | فوكسفورد",
  };
  const descriptions: Record<string, string> = {
    en: "Tips, guides and stories about learning English, French and other languages — written by the teachers at Voxford Language School.",
    fr: "Conseils, guides et témoignages sur l'apprentissage de l'anglais, du français et d'autres langues — écrits par les professeurs de Voxford.",
    ar: "نصائح وأدلة وقصص حول تعلّم الإنجليزية والفرنسية وغيرها من اللغات — بقلم أساتذة مدرسة فوكسفورد للغات.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${SITE_URL}/${locale}/blog`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: {
        en: `${SITE_URL}/en/blog`,
        fr: `${SITE_URL}/fr/blog`,
        ar: `${SITE_URL}/ar/blog`,
      },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const posts = await getPublishedPosts();

  const blogLabels: Record<string, { title: string; subtitle: string; readMore: string; noPosts: string; by: string }> = {
    en: {
      title: "Our Blog",
      subtitle: "Tips, guides, and stories about studying abroad",
      readMore: "Read more",
      noPosts: "No posts yet. Check back soon!",
      by: "By",
    },
    fr: {
      title: "Notre Blog",
      subtitle: "Conseils, guides et récits sur les études à l'étranger",
      readMore: "Lire la suite",
      noPosts: "Pas encore d'articles. Revenez bientôt !",
      by: "Par",
    },
    ar: {
      title: "مدونتنا",
      subtitle: "نصائح وأدلة وقصص حول الدراسة في الخارج",
      readMore: "اقرأ المزيد",
      noPosts: "لا توجد مقالات حتى الآن. عد قريبًا!",
      by: "بواسطة",
    },
  };

  const labels = blogLabels[locale] || blogLabels.en;

  // Split posts: first is featured, rest are grid
  const featuredPost = posts[0] || null;
  const gridPosts = posts.slice(1);

  return (
    <HomePageWrapper locale={locale} dict={dict}>
      {/* Blog JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: labels.title,
            description: labels.subtitle,
            url: `${SITE_URL}/${locale}/blog`,
            publisher: {
              "@type": "Organization",
              name: "Voxford",
              url: SITE_URL,
            },
          }),
        }}
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            Blog
          </span>
          <h1 className="mt-4 text-3xl font-bold text-brand sm:text-4xl lg:text-5xl">
            {labels.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft/60 sm:text-lg">
            {labels.subtitle}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline py-20">
            <svg className="mb-4 h-12 w-12 text-ink-soft/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-base font-medium text-ink-soft/40">
              {labels.noPosts}
            </p>
          </div>
        ) : (
          <>
            {/* Featured post (first post) */}
            {featuredPost && (() => {
              const localized = getLocalizedPost(featuredPost, locale);
              return (
                <Link
                  href={`/${locale}/blog/${featuredPost.slug}`}
                  className="group mb-12 block overflow-hidden rounded-3xl border border-hairline bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="relative aspect-[16/10] md:aspect-auto">
                      {featuredPost.coverImage ? (
                        <Image
                          src={featuredPost.coverImage}
                          alt={localized.title}
                          fill
                          className="object-cover transition group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      ) : (
                        <div className="flex h-full min-h-[240px] items-center justify-center bg-brand/5">
                          <svg className="h-16 w-16 text-brand/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
                      <div className="mb-3 flex items-center gap-3 text-sm text-ink-soft/50">
                        <time dateTime={featuredPost.createdAt.toISOString()}>
                          {new Date(featuredPost.createdAt).toLocaleDateString(
                            locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </time>
                        <span>&middot;</span>
                        <span>{labels.by} {featuredPost.author.name}</span>
                      </div>
                      <h2 className="text-2xl font-bold leading-tight text-brand sm:text-3xl">
                        {localized.title}
                      </h2>
                      <p className="mt-3 text-base leading-relaxed text-ink-soft/60 line-clamp-3">
                        {localized.excerpt}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition group-hover:gap-3">
                        {labels.readMore}
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* Grid posts */}
            {gridPosts.length > 0 && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => {
                  const localized = getLocalizedPost(post, locale);
                  return (
                    <Link
                      key={post.id}
                      href={`/${locale}/blog/${post.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      {post.coverImage ? (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={localized.title}
                            fill
                            className="object-cover transition group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[16/9] items-center justify-center bg-brand/5">
                          <svg className="h-12 w-12 text-brand/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-2 flex items-center gap-2 text-xs text-ink-soft/45">
                          <time dateTime={post.createdAt.toISOString()}>
                            {new Date(post.createdAt).toLocaleDateString(
                              locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB",
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </time>
                          <span>&middot;</span>
                          <span>{post.author.name}</span>
                        </div>
                        <h2 className="text-lg font-bold leading-snug text-brand line-clamp-2">
                          {localized.title}
                        </h2>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft/60 line-clamp-3">
                          {localized.excerpt}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition group-hover:gap-3">
                          {labels.readMore}
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </HomePageWrapper>
  );
}
