UPDATE "prisma_lab"."roll_attempt"
SET "command_fingerprint" = 'legacy:' || "id"::text
WHERE "command_fingerprint" IS NULL;
