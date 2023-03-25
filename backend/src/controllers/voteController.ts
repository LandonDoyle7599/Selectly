import { Card, PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/types";
import { VoteBody } from "../dto/voteTypes";
import { controller } from "../lib/controller";

const vote =
  (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
      const { cardId, deckId, vote } = req.body as VoteBody;
      const userId = req.jwtBody?.userId;
      const deck = await client.votingDeck.findUnique({
        where: {
          id: deckId
        },
        include: {
          votes: true,
          cards: true,
          users: true,
        },
      })
      const newVote = await client.vote.create({
        data: {
          card: {
            connect: { id: cardId }
          },
          deck: {
            connect: { id: deckId }
          },
          user: {
            connect: { id: userId }
          },
          vote
        }
      });
      const newDeck = await client.votingDeck.findUnique({
        where: {
          id: deckId
        },
        include: {
          votes: true,
          cards: true,
          users: true,
        },
      });

      await client.votingDeck.update({
        where: {
          id: deckId
        },
        data: {
          votes: { connect: { id: newVote.id } }
        }
      });

      const allVotes = newDeck?.votes;
      let userVoteCount = 0;
      if (allVotes) {
        for (let vote of allVotes) {
          if (vote.userId === userId) {
            userVoteCount++;
          }
        }
      };

      if (deck && userVoteCount === deck.cards.length) {
        const newDeck = await client.votingDeck.update({
          where: {
            id: deckId
          },
          include: {
            finishedUsers: true
          },
          data: {
            finishedUsers: { connect: { id: userId } }
          }
        });
        if (newDeck && newDeck.finishedUsers.length === deck.users.length) {
          const finalDeck = await client.votingDeck.update({
            where: {
              id: deckId
            },
            data: {
              status: "finished"
            },
            include: {
              cards: true,
              votes: true
            }
          });
          res.json({ finalDeck });
          return;
        }
      } else {
        res.json({ waitingForFriends: true });
        return;
      }
      res.json({});
    };


export const voteController = controller("vote", [
  { path: "/", endpointBuilder: vote, method: "post" },
]);
