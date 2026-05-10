ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN IF NOT EXISTS "preferredCurrency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "TraveloopTrip" (
  "id" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "coverImageUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'planning',
  "visibility" TEXT NOT NULL DEFAULT 'private',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TraveloopTrip_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopTripMember" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'viewer',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TraveloopTripMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopCity" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "region" TEXT,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "costIndex" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "popularityScore" INTEGER NOT NULL DEFAULT 0,
  "imageUrl" TEXT,
  "description" TEXT,
  CONSTRAINT "TraveloopCity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopTripStop" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "cityId" TEXT NOT NULL,
  "stopOrder" INTEGER NOT NULL,
  "arrivalDate" TIMESTAMP(3),
  "departureDate" TIMESTAMP(3),
  "notes" TEXT,
  CONSTRAINT "TraveloopTripStop_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopCityActivity" (
  "id" TEXT NOT NULL,
  "cityId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "imageUrl" TEXT,
  "estimatedCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "durationMinutes" INTEGER,
  "avgRating" DOUBLE PRECISION,
  "isPopular" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "TraveloopCityActivity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopStopActivity" (
  "id" TEXT NOT NULL,
  "stopId" TEXT NOT NULL,
  "cityActivityId" TEXT NOT NULL,
  "activityDate" TIMESTAMP(3),
  "startTime" TEXT,
  "endTime" TEXT,
  "actualCost" DECIMAL(10,2),
  "status" TEXT NOT NULL DEFAULT 'planned',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "notes" TEXT,
  CONSTRAINT "TraveloopStopActivity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopTripBudget" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "totalBudget" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "estimatedTotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "actualSpent" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "overBudgetAlert" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "TraveloopTripBudget_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopBudgetItem" (
  "id" TEXT NOT NULL,
  "budgetId" TEXT NOT NULL,
  "stopId" TEXT,
  "category" TEXT NOT NULL,
  "label" TEXT,
  "estimatedAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "actualAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "itemDate" TIMESTAMP(3),
  CONSTRAINT "TraveloopBudgetItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopPackingChecklist" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "itemName" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'other',
  "isPacked" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TraveloopPackingChecklist_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopTripNote" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "stopId" TEXT,
  "title" TEXT,
  "content" TEXT,
  "noteDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TraveloopTripNote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopSharedItinerary" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "publicSlug" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "copyCount" INTEGER NOT NULL DEFAULT 0,
  "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),
  CONSTRAINT "TraveloopSharedItinerary_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TraveloopSavedDestination" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "cityId" TEXT NOT NULL,
  "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TraveloopSavedDestination_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TraveloopTripMember_tripId_userId_key" ON "TraveloopTripMember"("tripId", "userId");
CREATE UNIQUE INDEX "TraveloopTripBudget_tripId_key" ON "TraveloopTripBudget"("tripId");
CREATE UNIQUE INDEX "TraveloopSharedItinerary_tripId_key" ON "TraveloopSharedItinerary"("tripId");
CREATE UNIQUE INDEX "TraveloopSharedItinerary_publicSlug_key" ON "TraveloopSharedItinerary"("publicSlug");
CREATE UNIQUE INDEX "TraveloopSavedDestination_userId_cityId_key" ON "TraveloopSavedDestination"("userId", "cityId");
CREATE INDEX "TraveloopTrip_ownerId_idx" ON "TraveloopTrip"("ownerId");
CREATE INDEX "TraveloopTripMember_userId_idx" ON "TraveloopTripMember"("userId");
CREATE INDEX "TraveloopCity_name_idx" ON "TraveloopCity"("name");
CREATE INDEX "TraveloopCity_region_idx" ON "TraveloopCity"("region");
CREATE INDEX "TraveloopTripStop_tripId_idx" ON "TraveloopTripStop"("tripId");
CREATE INDEX "TraveloopTripStop_cityId_idx" ON "TraveloopTripStop"("cityId");
CREATE INDEX "TraveloopCityActivity_cityId_idx" ON "TraveloopCityActivity"("cityId");
CREATE INDEX "TraveloopStopActivity_stopId_idx" ON "TraveloopStopActivity"("stopId");
CREATE INDEX "TraveloopStopActivity_cityActivityId_idx" ON "TraveloopStopActivity"("cityActivityId");
CREATE INDEX "TraveloopBudgetItem_budgetId_idx" ON "TraveloopBudgetItem"("budgetId");
CREATE INDEX "TraveloopBudgetItem_stopId_idx" ON "TraveloopBudgetItem"("stopId");
CREATE INDEX "TraveloopPackingChecklist_tripId_idx" ON "TraveloopPackingChecklist"("tripId");
CREATE INDEX "TraveloopTripNote_tripId_idx" ON "TraveloopTripNote"("tripId");
CREATE INDEX "TraveloopTripNote_userId_idx" ON "TraveloopTripNote"("userId");
CREATE INDEX "TraveloopTripNote_stopId_idx" ON "TraveloopTripNote"("stopId");
CREATE INDEX "TraveloopSavedDestination_cityId_idx" ON "TraveloopSavedDestination"("cityId");

ALTER TABLE "TraveloopTrip" ADD CONSTRAINT "TraveloopTrip_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopTripMember" ADD CONSTRAINT "TraveloopTripMember_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "TraveloopTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopTripMember" ADD CONSTRAINT "TraveloopTripMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopTripStop" ADD CONSTRAINT "TraveloopTripStop_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "TraveloopTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopTripStop" ADD CONSTRAINT "TraveloopTripStop_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "TraveloopCity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TraveloopCityActivity" ADD CONSTRAINT "TraveloopCityActivity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "TraveloopCity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopStopActivity" ADD CONSTRAINT "TraveloopStopActivity_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "TraveloopTripStop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopStopActivity" ADD CONSTRAINT "TraveloopStopActivity_cityActivityId_fkey" FOREIGN KEY ("cityActivityId") REFERENCES "TraveloopCityActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TraveloopTripBudget" ADD CONSTRAINT "TraveloopTripBudget_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "TraveloopTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopBudgetItem" ADD CONSTRAINT "TraveloopBudgetItem_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "TraveloopTripBudget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopBudgetItem" ADD CONSTRAINT "TraveloopBudgetItem_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "TraveloopTripStop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TraveloopPackingChecklist" ADD CONSTRAINT "TraveloopPackingChecklist_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "TraveloopTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopTripNote" ADD CONSTRAINT "TraveloopTripNote_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "TraveloopTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopTripNote" ADD CONSTRAINT "TraveloopTripNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopTripNote" ADD CONSTRAINT "TraveloopTripNote_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "TraveloopTripStop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TraveloopSharedItinerary" ADD CONSTRAINT "TraveloopSharedItinerary_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "TraveloopTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopSavedDestination" ADD CONSTRAINT "TraveloopSavedDestination_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraveloopSavedDestination" ADD CONSTRAINT "TraveloopSavedDestination_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "TraveloopCity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

