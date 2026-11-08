"use server";

import prisma from "@/lib/prisma";

export interface ContactFormData {
  name: string;
  phone: string;
  studyField?: string;
  country?: string;
  startDate?: string;
  email?: string;
  message?: string;
  website?: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactFormResponse> {
  try {
    if (data.website?.trim()) {
      return { success: true, message: "Thank you for your enquiry." };
    }
    const name = data.name?.trim();
    const phone = data.phone?.trim();
    if (!name || name.length < 2 || name.length > 100 || !phone || !/^[+0-9 ()-]{6,24}$/.test(phone)) {
      return {
        success: false,
        message: "Please enter a valid name and phone number.",
        error: "VALIDATION_ERROR",
      };
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return {
          success: false,
          message: "Please enter a valid email address.",
          error: "INVALID_EMAIL",
        };
      }
    }

    const parts: string[] = [];
    if (data.studyField) parts.push(`📚 Language/interest: ${data.studyField.slice(0, 100)}`);
    if (data.country) parts.push(`🌍 Destination: ${data.country}`);
    if (data.startDate) parts.push(`📅 Start: ${data.startDate}`);
    if (data.message?.trim()) parts.push(`\n💬 Message:\n${data.message.trim().slice(0, 2000)}`);
    const composedMessage = parts.length ? parts.join("\n") : null;

    // Create contact in database
    await prisma.contact.create({
      data: {
        name,
        email: data.email?.trim().toLowerCase() ?? null,
        phone,
        message: composedMessage ?? "",
      },
    });

    return {
      success: true,
      message: "Thank you for reaching out! We will get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
      error: "SERVER_ERROR",
    };
  }
}

/**
 * How many people have pre-registered. Real count, used by the footer's
 * scarcity strip — never a hardcoded figure.
 * Returns 0 if the database is unreachable, which makes the strip fall back
 * to the no-number "limited places" wording rather than showing a wrong count.
 */
export async function getPreRegistrationCount(): Promise<number> {
  try {
    return await prisma.contact.count();
  } catch {
    return 0;
  }
}
