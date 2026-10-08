UPDATE "drizzle_lab"."roll_attempt"
SET "correlation_id" = "id"
WHERE "correlation_id" IS NULL;
