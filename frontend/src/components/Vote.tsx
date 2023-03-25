import { useApi } from "../hooks/useApi";
import { User, VotingDeck } from "../models";
import { ItemCard } from "./ItemCard";

export type VoteType = "like" | "dislike";

export type handleVoteProps = {
  vote: VoteType;
  user: User;
  deck: VotingDeck;
};

export const Vote = (deck: VotingDeck) => {
  const api = useApi();
  const title = "Title";
  const description = "Description";
  const imageURL = "https://picsum.photos/200/300";
  const id = 1;
  const user = { id: 1, username: "test" };

  const handleVote = (vote: VoteType) => {
    // TODO: Verify this endpoint
    api.post("vote", { vote, user, deck });
  };

  return (
    <ItemCard
      title={title}
      description={description}
      imageURL={imageURL}
      handleVote={handleVote}
      id={id}
    ></ItemCard>
  );
};
