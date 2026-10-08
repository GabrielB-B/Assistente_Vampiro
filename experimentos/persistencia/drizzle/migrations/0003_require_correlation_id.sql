ALTER TABLE "drizzle_lab"."roll_attempt" ALTER COLUMN "correlation_id" SET NOT NULL;
--> statement-breakpoint
CREATE INDEX "ix_roll_attempt_correlation" ON "drizzle_lab"."roll_attempt" ("correlation_id");
