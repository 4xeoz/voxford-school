/**
 * Seed script to create the super admin account.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *
 * This only needs to run once. It creates the super admin if it
 * doesn't already exist, or updates the role if the account exists.
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Read from the environment — never hardcode credentials in source. Anything
// committed here is permanent in git history and public the moment the repo is.
//
//   SUPER_ADMIN_EMAIL=you@example.com \
//   SUPER_ADMIN_PASSWORD='...' \
//   npx tsx scripts/seed-admin.ts
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be set before seeding an admin.`);
  return value;
}

async function main() {
  const SUPER_ADMIN_EMAIL = required("SUPER_ADMIN_EMAIL");
  const SUPER_ADMIN_PASSWORD = required("SUPER_ADMIN_PASSWORD");
  const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME ?? "Admin";

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

  const admin = await prisma.admin.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: { role: "SUPER_ADMIN", password: hashedPassword },
    create: {
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      name: SUPER_ADMIN_NAME,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Super admin seeded: ${admin.email} (${admin.role})`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
