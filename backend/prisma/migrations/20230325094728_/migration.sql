/*
  Warnings:

  - Added the required column `customDeckId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votingDeckId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vote` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "photoURL" TEXT,
    "link" TEXT,
    "votingDeckId" INTEGER NOT NULL,
    "customDeckId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Card_votingDeckId_fkey" FOREIGN KEY ("votingDeckId") REFERENCES "VotingDeck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Card_customDeckId_fkey" FOREIGN KEY ("customDeckId") REFERENCES "CustomDeck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("content", "createdAt", "id", "link", "photoURL", "title", "updatedAt") SELECT "content", "createdAt", "id", "link", "photoURL", "title", "updatedAt" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE TABLE "new_Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vote" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vote_id_fkey" FOREIGN KEY ("id") REFERENCES "VotingDeck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_id_fkey" FOREIGN KEY ("id") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
