ALTER TABLE "drizzle_lab"."roll_attempt"
  ALTER COLUMN "command_fingerprint" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "drizzle_lab"."roll_attempt"
  ADD CONSTRAINT "ck_roll_attempt_command_fingerprint"
  CHECK ("command_fingerprint" <> '');
