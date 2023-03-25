import { ItemCard } from "../components/ItemCard";

export type VoteType = "like" | "dislike";

export const Vote = () => {
  const title = "Title";
  const description = "Description";
  const imageURL = "https://picsum.photos/200/300";
  const id = 1;
  const handleVote = (vote: VoteType) => {};

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
