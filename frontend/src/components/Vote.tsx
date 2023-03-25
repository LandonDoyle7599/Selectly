import { useApi } from "../hooks/useApi";
import { Card, User, VotingDeck } from "../models";
import "../styles/voteStyles.css";
import { ItemCard } from "./ItemCard";
import { PickItem } from "./PickItem";

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
    console.log(`Card: ${cardID} was ${vote}d by ${user.firstName}`);
    // const res = await api.post("vote", {
    //   vote,
    //   user: user.id,
    //   deck: deck.id,
    //   card: cardID,
    // });
    // console.log(res);
  };

  return (
    <div className="card-swiper">
      <div className="card-groups">
        <div className="card-group">
          {deck.cards.map((card) => (
            <div className="big-card item-card ">
              <ItemCard
                key={card.id}
                title={card.title}
                description={card.content}
                photoURL={card.photoURL}
                handleVote={handleVote}
                id={card.id}
              ></ItemCard>
            </div>
          ))}
        </div>
        {/* <div className="card-group">
          {deck.cards.map((card) => (
            <div className="big-card card">
              <ItemCard
                key={card.id}
                title={card.title}
                description={card.content}
                photoURL={card.photoURL}
                handleVote={handleVote}
                id={card.id}
              ></ItemCard>
            </div>
          ))}
        </div>
        <div className="card-group">
          {deck.cards.map((card) => (
            <div className="big-card card">
              <ItemCard
                key={card.id}
                title={card.title}
                description={card.content}
                photoURL={card.photoURL}
                handleVote={handleVote}
                id={card.id}
              ></ItemCard>
            </div>
          ))}
        </div> */}
      </div>
      <div>
        <PickItem handleVote={handleVote} id={1}></PickItem>
      </div>
    </div>
  );
};
