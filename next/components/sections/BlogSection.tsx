import Link from "next/link";
import Image from "next/image";
import { getRecentPosts } from "@/actions/blog";
import { getLocalizedPost } from "@/lib/blog";

interface BlogSectionProps {
  locale: string;
}

const CATEGORIES = ["Tous", "Visa", "Universités", "Bourses", "Conseils"];

const labels: Record<string, {
  title: string;
  readMore: string;
  viewAll: string;
  featured: string;
  minRead: string;
}> = {
  en: {
    title: "Our Latest News",
    readMore: "Read article",
    viewAll: "View all articles",
    featured: "Featured",
    minRead: "min read",
  },
  fr: {
    title: "Nos actualités",
    readMore: "Lire l'article",
    viewAll: "Voir tous les articles",
    featured: "À la une",
    minRead: "min de lecture",
  },
  ar: {
    title: "آخر أخبارنا",
    readMore: "اقرأ المقال",
    viewAll: "عرض جميع المقالات",
    featured: "مميز",
    minRead: "دقائق قراءة",
  },
};

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogSection({ locale }: BlogSectionProps) {
  const posts = await getRecentPosts(4);

  if (posts.length === 0) return null;

  const l = labels[locale] || labels.en;
  const [featured, ...rest] = posts;
  const featuredLocalized = getLocalizedPost(featured, locale);

  return (
    <section id="blog" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[--color-brand-primary] sm:text-4xl lg:text-5xl">
              {l.title}
            </h2>
          </div>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 self-start rounded-full border border-[--color-border-soft] px-5 py-2.5 text-sm font-semibold text-[--color-brand-primary] transition hover:border-[--color-brand-primary]/40 hover:shadow-sm sm:self-auto"
          >
            {l.viewAll}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* ── Category tabs ─────────────────────────────────────── */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className={`cursor-default rounded-full px-4 py-1.5 text-sm font-medium ${
                cat === "Tous"
                  ? "bg-[--color-brand-primary] text-white"
                  : "bg-[--color-brand-primary]/5 text-[--color-brand-primary]/60"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* ── Asymmetric grid ──────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">

          {/* LEFT — Featured card (60%) */}
          <Link
            href={`/${locale}/blog/${featured.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-xl"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[--color-brand-primary]/5">
              {featured.coverImage ? (
                <Image
                  src={featured.coverImage}
                  alt={featuredLocalized.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg className="h-16 w-16 text-[--color-brand-primary]/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
              )}
              {/* Featured badge */}
              <span className="absolute left-4 top-4 rounded-full bg-[--color-brand-secondary] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {l.featured}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-center gap-3 text-xs text-[--color-text-primary]/50">
                <time>
                  {new Date(featured.createdAt).toLocaleDateString(
                    locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
                <span>·</span>
                <span>{estimateReadTime(featuredLocalized.excerpt + featuredLocalized.title)} {l.minRead}</span>
              </div>
              <h3 className="mt-3 text-xl font-bold leading-snug text-[--color-brand-primary] line-clamp-2 sm:text-2xl">
                {featuredLocalized.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[--color-text-primary]/65 line-clamp-3">
                {featuredLocalized.excerpt}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[--color-brand-secondary] transition group-hover:gap-3">
                {l.readMore}
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
          </Link>

          {/* RIGHT — Stacked cards (40%) */}
          <div className="flex flex-col gap-4">
            {rest.slice(0, 3).map((post, i) => {
              const localized = getLocalizedPost(post, locale);
              return (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group flex gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[--color-brand-primary]/5 sm:h-28 sm:w-28">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={localized.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="112px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-8 w-8 text-[--color-brand-primary]/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                    )}
                    {/* "New" badge on first stacked post */}
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded-md bg-[--color-brand-primary] px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                        New
                      </span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex min-w-0 flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs text-[--color-text-primary]/50">
                      <time>
                        {new Date(post.createdAt).toLocaleDateString(
                          locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </time>
                      <span>·</span>
                      <span>{estimateReadTime(localized.excerpt + localized.title)} {l.minRead}</span>
                    </div>
                    <h3 className="mt-1.5 text-sm font-bold leading-snug text-[--color-brand-primary] line-clamp-2">
                      {localized.title}
                    </h3>
                    <p className="mt-1 text-xs text-[--color-text-primary]/60 line-clamp-2">
                      {localized.excerpt}
                    </p>
                  </div>
                </Link>
              );
            })}

            {/* Newsletter signup card */}
            <div className="rounded-2xl bg-[--color-brand-primary] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                {locale === "ar" ? "النشرة الإخبارية" : locale === "fr" ? "Newsletter" : "Newsletter"}
              </p>
              <p className="mt-1.5 text-base font-bold leading-snug">
                {locale === "ar"
                  ? "ابق على اطلاع بآخر الأخبار"
                  : locale === "fr"
                  ? "Restez informé des dernières actualités"
                  : "Stay updated with latest news"}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[--color-brand-secondary] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {locale === "ar" ? "اشترك مجاناً" : locale === "fr" ? "S'abonner" : "Subscribe free"}
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
