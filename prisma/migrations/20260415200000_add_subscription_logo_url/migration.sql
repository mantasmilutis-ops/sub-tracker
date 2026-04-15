-- Add logoUrl if absent; no-op if already present
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT DEFAULT '/logos/subtracker.svg';
-- Backfill any pre-existing NULLs before enforcing NOT NULL
UPDATE "Subscription" SET "logoUrl" = '/logos/subtracker.svg' WHERE "logoUrl" IS NULL;
-- Enforce NOT NULL and set the permanent default
ALTER TABLE "Subscription" ALTER COLUMN "logoUrl" SET NOT NULL;
ALTER TABLE "Subscription" ALTER COLUMN "logoUrl" SET DEFAULT '/logos/subtracker.svg';
