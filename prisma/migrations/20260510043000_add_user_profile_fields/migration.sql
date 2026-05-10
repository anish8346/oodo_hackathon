ALTER TABLE "User"
ADD COLUMN "firstName" TEXT,
ADD COLUMN "lastName" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "country" TEXT,
ADD COLUMN "additionalInfo" TEXT,
ADD COLUMN "image" TEXT;

UPDATE "User"
SET
  "firstName" = COALESCE(NULLIF(split_part(COALESCE("name", ''), ' ', 1), ''), split_part("email", '@', 1)),
  "lastName" = COALESCE(NULLIF(trim(substr(COALESCE("name", ''), length(split_part(COALESCE("name", ''), ' ', 1)) + 1)), ''), '');

ALTER TABLE "User"
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;
