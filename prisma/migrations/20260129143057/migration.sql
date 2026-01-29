/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN "shareToken" TEXT;

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Response_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_shareToken_key" ON "Quiz"("shareToken");
