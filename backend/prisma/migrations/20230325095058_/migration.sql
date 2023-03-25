-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "photoURL" TEXT,
    "link" TEXT,
    "votingDeckId" INTEGER,
    "customDeckId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Card_votingDeckId_fkey" FOREIGN KEY ("votingDeckId") REFERENCES "VotingDeck" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Card_customDeckId_fkey" FOREIGN KEY ("customDeckId") REFERENCES "CustomDeck" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("content", "createdAt", "customDeckId", "id", "link", "photoURL", "title", "updatedAt", "votingDeckId") SELECT "content", "createdAt", "customDeckId", "id", "link", "photoURL", "title", "updatedAt", "votingDeckId" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
