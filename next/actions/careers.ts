"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteObject } from "@/lib/storage";
import type { EmploymentType } from "@prisma/client";

async function requireStaff() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if ((session.user as { kind?: string }).kind !== "staff") {
    throw new Error("Unauthorized");
  }
  return session;
}

async function requireAdminOrAbove() {
  const session = await requireStaff();
  const role = (session.user as { role?: string }).role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
] as const;

function parseEmploymentType(value: unknown): EmploymentType {
  return EMPLOYMENT_TYPES.includes(value as (typeof EMPLOYMENT_TYPES)[number])
    ? (value as EmploymentType)
    : "FULL_TIME";
}

function readJobForm(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const department = (formData.get("department") as string)?.trim() || null;
  const requirements = (formData.get("requirements") as string)?.trim() || null;
  const salaryRange = (formData.get("salaryRange") as string)?.trim() || null;
  const closesAtStr = (formData.get("closesAt") as string)?.trim();
  const employmentType = parseEmploymentType(formData.get("employmentType"));

  return {
    title,
    description,
    location,
    department,
    requirements,
    salaryRange,
    employmentType,
    closesAt: closesAtStr ? new Date(closesAtStr) : null,
  };
}

// ─── Admin: Create job ──────────────────────────────────────────────────────

export async function createJob(formData: FormData) {
  const session = await requireAdminOrAbove();
  const data = readJobForm(formData);

  if (!data.title || !data.description || !data.location) {
    return { error: "Title, description and location are required" };
  }

  try {
    const job = await prisma.jobPost.create({
      data: {
        ...data,
        slug: generateSlug(data.title),
        createdById: session.user.id!,
      },
    });

    revalidatePath("/admin/careers");
    return { success: true, id: job.id, slug: job.slug };
  } catch {
    return { error: "Failed to create job post. Please try again." };
  }
}

// ─── Admin: List jobs ───────────────────────────────────────────────────────

export async function getJobs() {
  await requireAdminOrAbove();

  return prisma.jobPost.findMany({
    include: {
      createdBy: { select: { name: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Admin: Single job ──────────────────────────────────────────────────────

export async function getJobById(id: string) {
  await requireAdminOrAbove();

  return prisma.jobPost.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      _count: { select: { applications: true } },
    },
  });
}

// ─── Admin: Update job ──────────────────────────────────────────────────────

export async function updateJob(id: string, formData: FormData) {
  await requireAdminOrAbove();
  const data = readJobForm(formData);

  if (!data.title || !data.description || !data.location) {
    return { error: "Title, description and location are required" };
  }

  try {
    await prisma.jobPost.update({ where: { id }, data });

    revalidatePath("/admin/careers");
    revalidatePath(`/admin/careers/${id}`);
    return { success: true };
  } catch {
    return { error: "Failed to update job post." };
  }
}

// ─── Admin: Toggle open/closed ──────────────────────────────────────────────

export async function toggleJobStatus(id: string, isActive: boolean) {
  await requireAdminOrAbove();

  await prisma.jobPost.update({ where: { id }, data: { isActive } });

  revalidatePath("/admin/careers");
  revalidatePath(`/admin/careers/${id}`);
  return { success: true };
}

// ─── Admin: Delete job ──────────────────────────────────────────────────────

export async function deleteJob(id: string) {
  await requireAdminOrAbove();

  // Applications cascade. Their CV objects are removed first so the private
  // bucket doesn't accumulate files no row points at any more.
  const applications = await prisma.jobApplication.findMany({
    where: { jobId: id },
    select: { cvPath: true },
  });

  await Promise.allSettled(applications.map((a) => deleteObject(a.cvPath)));

  await prisma.jobPost.delete({ where: { id } });
  revalidatePath("/admin/careers");
  return { success: true };
}

// ─── Public: Open jobs ──────────────────────────────────────────────────────

const PUBLIC_JOB_FIELDS = {
  id: true,
  slug: true,
  title: true,
  department: true,
  location: true,
  employmentType: true,
  description: true,
  requirements: true,
  salaryRange: true,
  closesAt: true,
  isActive: true,
  createdAt: true,
} as const;

export async function getOpenJobs() {
  return prisma.jobPost.findMany({
    where: {
      isActive: true,
      OR: [{ closesAt: null }, { closesAt: { gte: new Date() } }],
    },
    select: PUBLIC_JOB_FIELDS,
    orderBy: { createdAt: "desc" },
  });
}

export async function getJobBySlug(slug: string) {
  return prisma.jobPost.findUnique({
    where: { slug },
    select: PUBLIC_JOB_FIELDS,
  });
}

/** Slugs for the sitemap. Open postings only. */
export async function getOpenJobSlugs() {
  return prisma.jobPost.findMany({
    where: {
      isActive: true,
      OR: [{ closesAt: null }, { closesAt: { gte: new Date() } }],
    },
    select: { slug: true, updatedAt: true },
  });
}

/** True when the posting still accepts applications. */
export async function isJobOpen(jobId: string): Promise<boolean> {
  const job = await prisma.jobPost.findUnique({
    where: { id: jobId },
    select: { isActive: true, closesAt: true },
  });

  if (!job || !job.isActive) return false;
  if (job.closesAt && job.closesAt < new Date()) return false;
  return true;
}
