"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --------------- Auth helper ---------------

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

// --------------- Helpers ---------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// --------------- Public queries ---------------

export async function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: { select: { id: true, name: true } } },
  });
}

export async function getRecentPosts(limit: number = 3) {
  return prisma.blogPost.findMany({
    where: { published: true },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllPublishedSlugs() {
  return prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
}

// --------------- Admin queries ---------------

export async function getAdminPosts() {
  await requireAuth();
  return prisma.blogPost.findMany({
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostById(id: string) {
  await requireAuth();
  return prisma.blogPost.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });
}

// --------------- Create ---------------

export async function createPost(formData: FormData) {
  const session = await requireAuth();

  const titleEn = (formData.get("titleEn") as string)?.trim();
  const excerptEn = (formData.get("excerptEn") as string)?.trim();
  const contentEn = (formData.get("contentEn") as string)?.trim();

  if (!titleEn || !excerptEn || !contentEn) {
    return { error: "Title, excerpt, and content (English) are required." };
  }

  // Generate slug from English title
  let slug = slugify(titleEn);

  // Ensure uniqueness
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const post = await prisma.blogPost.create({
    data: {
      slug,
      published: formData.get("published") === "true",
      titleEn,
      excerptEn,
      contentEn,
      metaTitleEn: (formData.get("metaTitleEn") as string)?.trim() || null,
      metaDescEn: (formData.get("metaDescEn") as string)?.trim() || null,
      keywordsEn: (formData.get("keywordsEn") as string)?.trim() || null,
      titleFr: (formData.get("titleFr") as string)?.trim() || null,
      excerptFr: (formData.get("excerptFr") as string)?.trim() || null,
      contentFr: (formData.get("contentFr") as string)?.trim() || null,
      metaTitleFr: (formData.get("metaTitleFr") as string)?.trim() || null,
      metaDescFr: (formData.get("metaDescFr") as string)?.trim() || null,
      keywordsFr: (formData.get("keywordsFr") as string)?.trim() || null,
      titleAr: (formData.get("titleAr") as string)?.trim() || null,
      excerptAr: (formData.get("excerptAr") as string)?.trim() || null,
      contentAr: (formData.get("contentAr") as string)?.trim() || null,
      metaTitleAr: (formData.get("metaTitleAr") as string)?.trim() || null,
      metaDescAr: (formData.get("metaDescAr") as string)?.trim() || null,
      keywordsAr: (formData.get("keywordsAr") as string)?.trim() || null,
      coverImage: (formData.get("coverImage") as string)?.trim() || null,
      authorId: session.user.id!,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true, postId: post.id };
}

// --------------- Update ---------------

export async function updatePost(id: string, formData: FormData) {
  await requireAuth();

  const titleEn = (formData.get("titleEn") as string)?.trim();
  const excerptEn = (formData.get("excerptEn") as string)?.trim();
  const contentEn = (formData.get("contentEn") as string)?.trim();

  if (!titleEn || !excerptEn || !contentEn) {
    return { error: "Title, excerpt, and content (English) are required." };
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      published: formData.get("published") === "true",
      titleEn,
      excerptEn,
      contentEn,
      metaTitleEn: (formData.get("metaTitleEn") as string)?.trim() || null,
      metaDescEn: (formData.get("metaDescEn") as string)?.trim() || null,
      keywordsEn: (formData.get("keywordsEn") as string)?.trim() || null,
      titleFr: (formData.get("titleFr") as string)?.trim() || null,
      excerptFr: (formData.get("excerptFr") as string)?.trim() || null,
      contentFr: (formData.get("contentFr") as string)?.trim() || null,
      metaTitleFr: (formData.get("metaTitleFr") as string)?.trim() || null,
      metaDescFr: (formData.get("metaDescFr") as string)?.trim() || null,
      keywordsFr: (formData.get("keywordsFr") as string)?.trim() || null,
      titleAr: (formData.get("titleAr") as string)?.trim() || null,
      excerptAr: (formData.get("excerptAr") as string)?.trim() || null,
      contentAr: (formData.get("contentAr") as string)?.trim() || null,
      metaTitleAr: (formData.get("metaTitleAr") as string)?.trim() || null,
      metaDescAr: (formData.get("metaDescAr") as string)?.trim() || null,
      keywordsAr: (formData.get("keywordsAr") as string)?.trim() || null,
      coverImage: (formData.get("coverImage") as string)?.trim() || null,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

// --------------- Delete ---------------

export async function deletePost(id: string) {
  await requireAuth();

  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

// --------------- Toggle publish ---------------

export async function togglePublish(id: string) {
  await requireAuth();

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return { error: "Post not found." };

  await prisma.blogPost.update({
    where: { id },
    data: { published: !post.published },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}
