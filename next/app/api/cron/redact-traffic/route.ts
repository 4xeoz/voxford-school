import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Clear identifying visit details daily while retaining page/event counts. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse(null, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await prisma.trafficEvent.updateMany({
    where: {
      createdAt: { lt: cutoff },
      OR: [{ ipAddress: { not: null } }, { deviceType: { not: null } }],
    },
    data: {
      referrer: null,
      ipAddress: null,
      countryCode: null,
      regionCode: null,
      city: null,
      deviceType: null,
      deviceModel: null,
      osName: null,
      osVersion: null,
      browserName: null,
      browserVersion: null,
      screenWidth: null,
      screenHeight: null,
      viewportWidth: null,
      viewportHeight: null,
    },
  });

  return NextResponse.json({ redacted: result.count });
}
