-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "surveyData" JSONB NOT NULL,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "totalResponses" INTEGER NOT NULL DEFAULT 0,
    "averageScore" REAL NOT NULL DEFAULT 0,
    "tags" JSONB NOT NULL DEFAULT [],
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
