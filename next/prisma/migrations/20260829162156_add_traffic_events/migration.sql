-- CreateEnum
CREATE TYPE "TrafficEventType" AS ENUM ('PAGE_VIEW', 'WHATSAPP_CLICK', 'CALL_CLICK', 'LOCATION_CLICK', 'EMAIL_CLICK');

-- CreateTable
CREATE TABLE "traffic_events" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "type" "TrafficEventType" NOT NULL,
    "locale" TEXT,
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "traffic_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "traffic_events_page_type_idx" ON "traffic_events"("page", "type");

-- CreateIndex
CREATE INDEX "traffic_events_created_at_idx" ON "traffic_events"("created_at");
