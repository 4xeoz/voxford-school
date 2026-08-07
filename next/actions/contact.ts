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
    if (!data.name || !data.phone) {
      return {
        success: false,
        message: "Please fill in your name and phone number.",
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
    if (data.studyField) parts.push(`📚 Field: ${data.studyField}`);
    if (data.country) parts.push(`🌍 Destination: ${data.country}`);
    if (data.startDate) parts.push(`📅 Start: ${data.startDate}`);
    if (data.message?.trim()) parts.push(`\n💬 Message:\n${data.message.trim()}`);
    const composedMessage = parts.length ? parts.join("\n") : null;

    // Create contact in database
    await prisma.contact.create({
      data: {
        name: data.name.trim(),
        email: data.email?.trim().toLowerCase() ?? null,
        phone: data.phone.trim() || null,
        message: composedMessage,
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
