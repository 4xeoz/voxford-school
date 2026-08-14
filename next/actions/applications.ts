"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { isJobOpen } from "@/actions/careers";
import { isValidWilayaCode } from "@/lib/wilayas";
import {
  ALLOWED_CV_TYPES,
  MAX_CV_BYTES,
  buildCvPath,
  createSignedDownloadUrl,
  createSignedUploadUrl,
  deleteObject,
  getObjectInfo,
} from "@/lib/storage";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@prisma/client";

async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user as { kind?: string }).kind !== "staff") {
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

// ─── Public: request a signed upload URL ────────────────────────────────────

/**
 * Hands the browser a one-shot URL to PUT the CV straight to storage.
 *
 * This is deliberately unauthenticated — applications need no account. The
 * checks that remain are: the job must be open, and the claimed type and size
 * must be plausible. Those are advisory, because the browser reports them, so
 * `submitApplication` re-reads the object's real size and type from storage
 * before writing a row.
 */
export async function requestCvUploadUrl(
  jobId: string,
  contentType: string,
  sizeBytes: number
) {
  const ext = ALLOWED_CV_TYPES[contentType];
  if (!ext) {
    return { error: "Please upload your CV as a PDF or Word document." };
  }

  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    return { error: "That file looks empty." };
  }

  if (sizeBytes > MAX_CV_BYTES) {
    return { error: "Your CV must be smaller than 5MB." };
  }

  if (!(await isJobOpen(jobId))) {
    return { error: "This position is no longer accepting applications." };
  }

  try {
    const objectPath = buildCvPath(jobId, ext);
    const { uploadUrl } = await createSignedUploadUrl(objectPath);
    return { success: true as const, uploadUrl, objectPath };
  } catch (error) {
    console.error("[CV] sign upload failed:", error);
    return { error: "Upload is unavailable right now. Please try again later." };
  }
}

// ─── Public: submit an application ──────────────────────────────────────────

export async function submitApplication(jobId: string, formData: FormData) {
  // Honeypot: a field hidden from humans by CSS. Anything that fills it in is
  // a bot walking the DOM. Fail quietly — telling a scraper why it was
  // rejected only helps it try again.
  if ((formData.get("website") as string)?.trim()) {
    return { success: true as const };
  }

  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const city = (formData.get("city") as string)?.trim() || null;
  const wilayaCode = Number(formData.get("wilayaCode"));

  const cvPath = (formData.get("cvPath") as string)?.trim();
  const cvFilename = (formData.get("cvFilename") as string)?.trim() || null;
  const coverLetter = (formData.get("coverLetter") as string)?.trim() || null;

  if (!firstName || !lastName || !email || !phone) {
    return { error: "Please fill in your name, email and phone number." };
  }

  if (!isValidWilayaCode(wilayaCode)) {
    return { error: "Please select your wilaya." };
  }

  if (!cvPath) return { error: "Please attach your CV." };

  // The client chose this path, so confirm it is one we issued for this job
  // and this shape — otherwise a crafted value could point the row at another
  // job's object.
  if (!cvPath.startsWith(`cv/${jobId}/`) || cvPath.includes("..")) {
    return { error: "That upload could not be verified. Please try again." };
  }

  if (!(await isJobOpen(jobId))) {
    return { error: "This position is no longer accepting applications." };
  }

  // Confirm what actually landed in storage. The browser's claimed size and
  // MIME type were only ever hints — this is the check that binds.
  const info = await getObjectInfo(cvPath);
  if (!info) {
    return { error: "We couldn't find your uploaded CV. Please attach it again." };
  }

  if (info.sizeBytes > MAX_CV_BYTES) {
    await deleteObject(cvPath).catch(() => {});
    return { error: "Your CV must be smaller than 5MB." };
  }

  if (!ALLOWED_CV_TYPES[info.contentType]) {
    await deleteObject(cvPath).catch(() => {});
    return { error: "Please upload your CV as a PDF or Word document." };
  }

  try {
    await prisma.jobApplication.create({
      data: {
        jobId,
        firstName,
        lastName,
        email,
        phone,
        wilayaCode,
        city,
        cvPath,
        cvFilename,
        coverLetter,
      },
    });
  } catch (error) {
    // Unique violation on (job_id, email) — they already applied.
    if ((error as { code?: string }).code === "P2002") {
      await deleteObject(cvPath).catch(() => {});
      return {
        error:
          "You have already applied for this position with this email address.",
      };
    }
    return { error: "Could not submit your application. Please try again." };
  }

  revalidatePath("/admin/careers");
  return { success: true as const };
}

// ─── Admin: applications for a job ──────────────────────────────────────────

export async function getApplicationsForJob(jobId: string) {
  await requireAdminOrAbove();

  return prisma.jobApplication.findMany({
    where: { jobId },
    include: {
      notes: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  await requireAdminOrAbove();

  await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status },
  });

  revalidatePath("/admin/careers");
  return { success: true };
}

export async function addApplicationNote(
  applicationId: string,
  content: string
) {
  const session = await requireAdminOrAbove();

  const trimmed = content.trim();
  if (!trimmed) return { error: "Note cannot be empty." };

  await prisma.jobApplicationNote.create({
    data: { applicationId, content: trimmed, authorId: session.user.id! },
  });

  revalidatePath("/admin/careers");
  return { success: true };
}

export async function deleteApplication(applicationId: string) {
  await requireAdminOrAbove();

  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    select: { cvPath: true },
  });

  if (!application) return { error: "Application not found." };

  await prisma.jobApplication.delete({ where: { id: applicationId } });
  await deleteObject(application.cvPath).catch(() => {});

  revalidatePath("/admin/careers");
  return { success: true };
}

/**
 * Mint a short-lived signed link to a CV.
 *
 * This is the only path by which a CV leaves storage. The bucket is private,
 * `cv_path` is never rendered to a client, and the link expires — so a URL
 * that leaks from an admin's history dies quickly.
 *
 * `mode` decides how the browser treats it:
 *   "view"     — served with its real content type, so a PDF renders inline.
 *                Given a longer window because it stays open in a preview pane.
 *   "download" — Content-Disposition: attachment, forcing a save-as.
 */
export async function getCvUrl(
  applicationId: string,
  mode: "view" | "download" = "view"
) {
  await requireAdminOrAbove();

  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    select: { cvPath: true, cvFilename: true, firstName: true, lastName: true },
  });

  if (!application) return { error: "Application not found." };

  // Name the saved file after the candidate — "test-cv.pdf" in a downloads
  // folder is useless once there are thirty of them.
  const ext = application.cvPath.split(".").pop() || "pdf";
  const safeName = `${application.firstName}-${application.lastName}-CV.${ext}`
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9._-]/g, "");

  try {
    const url = await createSignedDownloadUrl(
      application.cvPath,
      mode === "view" ? 300 : 60,
      mode === "download" ? safeName : undefined
    );
    return { success: true as const, url };
  } catch (error) {
    console.error("[CV] sign url failed:", error);
    return { error: "Could not open that CV. Please try again." };
  }
}
