import { spawnSync } from "node:child_process";
import { join } from "node:path";

// Vercel builds receive the production DIRECT_URL. Preview builds deliberately
// leave the shared database unchanged; production builds apply additive Prisma
// migrations before a new app version can be served.
if (process.env.VERCEL_ENV === "production") {
  if (!process.env.DIRECT_URL) {
    console.error("DIRECT_URL is required for production migrations");
    process.exit(1);
  }

  const prisma = join(process.cwd(), "node_modules", ".bin", "prisma");
  const result = spawnSync(prisma, ["migrate", "deploy"], { stdio: "inherit", env: process.env });
  if (result.error) console.error("Could not start Prisma migrate deploy:", result.error.message);
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
