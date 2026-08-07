"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

async function requireAdminOrAbove() {
  const session = await requireAuth();
  const role = (session.user as { role: string }).role;
  if (role === "OPERATOR") throw new Error("Unauthorized");
  return session;
}

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

// ─── Admin: Create event ───────────────────────────────────────────────────

export async function createEvent(formData: FormData) {
  const session = await requireAdminOrAbove();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const dateStr = formData.get("date") as string;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  if (!name || !description || !location || !dateStr) {
    return { error: "All fields are required" };
  }

  const slug = generateSlug(name);

  try {
    const event = await prisma.event.create({
      data: {
        name,
        description,
        location,
        date: new Date(dateStr),
        slug,
        imageUrl,
        createdById: session.user.id!,
      },
    });

    revalidatePath("/admin/events");
    return { success: true, id: event.id, slug: event.slug };
  } catch {
    return { error: "Failed to create event. Please try again." };
  }
}

// ─── Admin: Get all events ─────────────────────────────────────────────────

export async function getEvents() {
  await requireAdminOrAbove();

  return prisma.event.findMany({
    include: {
      createdBy: { select: { name: true } },
      _count: { select: { registrations: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Admin: Get single event by ID ─────────────────────────────────────────

export async function getEventById(id: string) {
  await requireAdminOrAbove();

  return prisma.event.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      registrations: { orderBy: { createdAt: "desc" } },
    },
  });
}

// ─── Admin: Update event ────────────────────────────────────────────────────

export async function updateEvent(id: string, formData: FormData) {
  await requireAdminOrAbove();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const dateStr = formData.get("date") as string;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  if (!name || !description || !location || !dateStr) {
    return { error: "All fields are required" };
  }

  try {
    await prisma.event.update({
      where: { id },
      data: { name, description, location, date: new Date(dateStr), imageUrl },
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    return { success: true };
  } catch {
    return { error: "Failed to update event." };
  }
}

// ─── Admin: Toggle active status ───────────────────────────────────────────

export async function toggleEventStatus(id: string, isActive: boolean) {
  await requireAdminOrAbove();

  await prisma.event.update({ where: { id }, data: { isActive } });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  return { success: true };
}

// ─── Admin: Delete event ────────────────────────────────────────────────────

export async function deleteEvent(id: string) {
  await requireAdminOrAbove();

  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  return { success: true };
}

// ─── Public: Get event by slug ─────────────────────────────────────────────

export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      date: true,
      isActive: true,
      slug: true,
      imageUrl: true,
      _count: { select: { registrations: true } },
    },
  });
}

// ─── Public: Get upcoming events ───────────────────────────────────────────

export async function getUpcomingEvents(limit = 6) {
  return prisma.event.findMany({
    where: {
      isActive: true,
      date: { gte: new Date() },
    },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      date: true,
      slug: true,
      imageUrl: true,
      _count: { select: { registrations: true } },
    },
    orderBy: { date: "asc" },
    take: limit,
  });
}

// ─── Public: Register for event ────────────────────────────────────────────

export async function registerForEvent(eventId: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim() || null;

  if (!name || !phone) {
    return { error: "Full name and phone number are required." };
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { isActive: true },
  });

  if (!event || !event.isActive) {
    return { error: "Registration for this event is closed." };
  }

  try {
    await prisma.eventRegistration.create({
      data: { eventId, name, phone, email, message },
    });

    return { success: true };
  } catch {
    return { error: "Registration failed. Please try again." };
  }
}

// ─── Admin: Mark attendee as attended ──────────────────────────────────────

export async function markAttended(registrationId: string, attended: boolean) {
  await requireAdminOrAbove();

  await prisma.eventRegistration.update({
    where: { id: registrationId },
    data: { attended },
  });

  return { success: true };
}
