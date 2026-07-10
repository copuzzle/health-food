-- CreateTable
CREATE TABLE "SymptomPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SymptomPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SymptomPreference_userId_sortOrder_idx" ON "SymptomPreference"("userId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SymptomPreference_userId_name_key" ON "SymptomPreference"("userId", "name");

-- AddForeignKey
ALTER TABLE "SymptomPreference" ADD CONSTRAINT "SymptomPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
