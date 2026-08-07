-- AlterTable: make email optional in contacts
ALTER TABLE "contacts" ALTER COLUMN "email" DROP NOT NULL;
