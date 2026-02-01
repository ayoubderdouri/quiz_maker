/*
  Warnings:

  - Added the required column `userId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- First, create a default admin user if none exists
INSERT OR IGNORE INTO "User" ("id", "email", "name", "password", "createdAt", "updatedAt") 
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'Admin', 'hashed_password', datetime('now'), datetime('now'));

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "shareToken" TEXT,
    CONSTRAINT "Quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Quiz" ("id", "userId", "data", "shareToken") 
SELECT "id", '00000000-0000-0000-0000-000000000000', "data", "shareToken" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
CREATE UNIQUE INDEX "Quiz_shareToken_key" ON "Quiz"("shareToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
