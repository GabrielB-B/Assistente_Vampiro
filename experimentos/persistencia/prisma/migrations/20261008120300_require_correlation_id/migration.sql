ALTER TABLE "prisma_lab"."roll_attempt" ALTER COLUMN "correlation_id" SET NOT NULL;
CREATE INDEX "ix_roll_attempt_correlation" ON "prisma_lab"."roll_attempt" ("correlation_id");
