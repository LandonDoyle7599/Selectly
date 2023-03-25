import { useApi } from "../hooks/useApi";
import { Card, User, VotingDeck } from "../models";
import "../styles/Vote.css";
import { ItemCard } from "./ItemCard";

export type VoteType = "like" | "dislike";

export type handleVoteProps = {
  vote: VoteType;
  user: User;
  deck: VotingDeck;
};

type VoteProps = {
  deck: VotingDeck;
  user: User;
};

export const Vote = (props: VoteProps) => {
  const api = useApi();
  const { deck, user } = props;

  const handleVote = async (vote: VoteType, cardID: number) => {
    // TODO: Verify this endpoint
    const res = await api.post("vote", {
      vote,
      user: user.id,
      deck: deck.id,
      card: cardID,
    });
    console.log(res);
  };

  return (
    <div>
      <div className="deck-container">
        {deck.cards.map((card) => (
          <ItemCard
            title={card.title}
            description={card.content}
            imageURL={card.photoURL}
            handleVote={handleVote}
            id={card.id}
          ></ItemCard>
        ))}
      </div>
    </div>
  );
};
