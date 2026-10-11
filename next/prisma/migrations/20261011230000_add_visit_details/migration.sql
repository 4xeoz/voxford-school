-- Nullable columns preserve historical events and permit the old app version
-- to write while the new deployment is being promoted.
ALTER TABLE "traffic_events"
  ADD COLUMN "ip_address" TEXT,
  ADD COLUMN "country_code" TEXT,
  ADD COLUMN "region_code" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "device_type" TEXT,
  ADD COLUMN "device_model" TEXT,
  ADD COLUMN "os_name" TEXT,
  ADD COLUMN "os_version" TEXT,
  ADD COLUMN "browser_name" TEXT,
  ADD COLUMN "browser_version" TEXT,
  ADD COLUMN "screen_width" INTEGER,
  ADD COLUMN "screen_height" INTEGER,
  ADD COLUMN "viewport_width" INTEGER,
  ADD COLUMN "viewport_height" INTEGER;
