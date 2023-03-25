/*
  Warnings:

  - You are about to drop the `_UserToVotingDeck` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserToVotingDeck";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_IncompleteVotes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_IncompleteVotes_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IncompleteVotes_B_fkey" FOREIGN KEY ("B") REFERENCES "VotingDeck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FinishedVotes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FinishedVotes_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FinishedVotes_B_fkey" FOREIGN KEY ("B") REFERENCES "VotingDeck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_IncompleteVotes_AB_unique" ON "_IncompleteVotes"("A", "B");

-- CreateIndex
CREATE INDEX "_IncompleteVotes_B_index" ON "_IncompleteVotes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FinishedVotes_AB_unique" ON "_FinishedVotes"("A", "B");

-- CreateIndex
CREATE INDEX "_FinishedVotes_B_index" ON "_FinishedVotes"("B");
