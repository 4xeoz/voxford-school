import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const VALID_TYPES = new Set([
  "PAGE_VIEW",
  "WHATSAPP_CLICK",
  "CALL_CLICK",
  "LOCATION_CLICK",
  "EMAIL_CLICK",
]);

export async function POST(req: NextRequest) {
  let body: { page?: unknown; type?: unknown; locale?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const page = typeof body.page === "string" ? body.page.slice(0, 100) : null;
  const type = typeof body.type === "string" ? body.type : null;
  const locale = typeof body.locale === "string" ? body.locale.slice(0, 10) : null;

  if (!page || !type || !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid page or type" }, { status: 400 });
  }

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
      referrer: req.headers.get("referer")?.slice(0, 300) ?? null,
    },
  });

  return NextResponse.json({ success: true });
}
