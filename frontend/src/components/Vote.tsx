import { useApi } from "../hooks/useApi";
import { Card, User, VotingDeck } from "../models";
import { ItemCard } from "./ItemCard";

export type VoteType = "like" | "dislike";

export type handleVoteProps = {
  vote: VoteType;
  user: User;
  deck: VotingDeck;
};

export const Vote = (deck: VotingDeck, user: User) => {
  const api = useApi();

  const handleVote = (vote: VoteType, cardID: number) => {
    // TODO: Verify this endpoint
    api.post("vote", { vote, user: user.id, deck: deck.id, card: cardID });
  };

  return (
    <>
      {deck.cards.map((card) => (
        <ItemCard
          title={card.title}
          description={card.content}
          imageURL={card.photoURL}
          handleVote={handleVote}
          id={card.id}
        ></ItemCard>
      ))}
    </>
  );
};
