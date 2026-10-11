import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseScreenDetails, parseUserAgent, referrerOrigin, requestGeo } from "@/lib/visitor-analytics";

const VALID_TYPES = new Set([
  "PAGE_VIEW",
  "WHATSAPP_CLICK",
  "CALL_CLICK",
  "LOCATION_CLICK",
  "EMAIL_CLICK",
]);

export async function POST(req: NextRequest) {
  let body: { page?: unknown; type?: unknown; locale?: unknown; referrer?: unknown; screen?: unknown };
  try {
    const raw = await req.text();
    if (raw.length > 2048) return NextResponse.json({ error: "Body too large" }, { status: 413 });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
    body = parsed;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const page = typeof body.page === "string" ? body.page.slice(0, 100) : null;
  const type = typeof body.type === "string" ? body.type : null;
  const locale = body.locale === "en" || body.locale === "fr" || body.locale === "ar" ? body.locale : null;

  if (!page || /[?#\x00-\x1f]/.test(page) || !type || !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid page or type" }, { status: 400 });
  }

  const visit = type === "PAGE_VIEW" ? {
    ...parseUserAgent(req.headers.get("user-agent") ?? ""),
    ...parseScreenDetails(body.screen && typeof body.screen === "object" && !Array.isArray(body.screen) ? body.screen : null),
    ...requestGeo(req.headers, process.env.VERCEL === "1"),
    referrer: referrerOrigin(body.referrer),
  } : {};

  await prisma.trafficEvent.create({
    data: {
      page,
      type: type as
        | "PAGE_VIEW"
        | "WHATSAPP_CLICK"
        | "CALL_CLICK"
        | "LOCATION_CLICK"
        | "EMAIL_CLICK",
      locale,
      ...visit,
    },
  });

  return NextResponse.json({ success: true });
}
