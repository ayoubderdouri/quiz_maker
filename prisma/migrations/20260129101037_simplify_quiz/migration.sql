/*
  Warnings:

  - You are about to drop the column `averageScore` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `surveyData` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuestions` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `totalResponses` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `data` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" JSONB NOT NULL
);
INSERT INTO "new_Quiz" ("id") SELECT "id" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
