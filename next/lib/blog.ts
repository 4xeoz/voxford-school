type BlogPostFields = {
  titleEn: string;
  excerptEn: string;
  contentEn: string;
  metaTitleEn: string | null;
  metaDescEn: string | null;
  keywordsEn: string | null;
  titleFr: string | null;
  excerptFr: string | null;
  contentFr: string | null;
  metaTitleFr: string | null;
  metaDescFr: string | null;
  keywordsFr: string | null;
  titleAr: string | null;
  excerptAr: string | null;
  contentAr: string | null;
  metaTitleAr: string | null;
  metaDescAr: string | null;
  keywordsAr: string | null;
};

export function getLocalizedPost(post: BlogPostFields, locale: string) {
  if (locale === "fr") {
    return {
      title: post.titleFr || post.titleEn,
      excerpt: post.excerptFr || post.excerptEn,
      content: post.contentFr || post.contentEn,
      metaTitle: post.metaTitleFr || post.metaTitleEn || post.titleFr || post.titleEn,
      metaDesc: post.metaDescFr || post.metaDescEn || post.excerptFr || post.excerptEn,
      keywords: post.keywordsFr || post.keywordsEn,
    };
  }
  if (locale === "ar") {
    return {
      title: post.titleAr || post.titleEn,
      excerpt: post.excerptAr || post.excerptEn,
      content: post.contentAr || post.contentEn,
      metaTitle: post.metaTitleAr || post.metaTitleEn || post.titleAr || post.titleEn,
      metaDesc: post.metaDescAr || post.metaDescEn || post.excerptAr || post.excerptEn,
      keywords: post.keywordsAr || post.keywordsEn,
    };
  }
  return {
    title: post.titleEn,
    excerpt: post.excerptEn,
    content: post.contentEn,
    metaTitle: post.metaTitleEn || post.titleEn,
    metaDesc: post.metaDescEn || post.excerptEn,
    keywords: post.keywordsEn,
  };
}
