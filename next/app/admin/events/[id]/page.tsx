export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { getEventById } from "@/actions/events";
import EventDetailClient from "./event-detail-client";
import QRCode from "qrcode";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role: string }).role;
  if (role === "OPERATOR") redirect("/admin/dashboard");

  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  // Build the URL from the actual request host so it works in any environment
  const headersList = await headers();
  const host = headersList.get("host") ?? "nopeca.com";
  const proto =
    headersList.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const origin = `${proto}://${host}`;
  const registrationUrl = `${origin}/en/events/${event.slug}`;

  // Generate QR code as a PNG data URL server-side
  const qrDataUrl = await QRCode.toDataURL(registrationUrl, {
    width: 512,
    margin: 2,
    color: { dark: "#0a1628", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });

  return (
    <EventDetailClient
      event={JSON.parse(JSON.stringify(event))}
      qrDataUrl={qrDataUrl}
      registrationUrl={registrationUrl}
    />
  );
}
