import React, { useEffect, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [lastIndex, setLastIndex] = useState(2);

  const [blendedDecks, setBlendedDecks] = useState<VotingDeck[]>([
    deck,
    deck,
    deck,
    deck,
  ]);

  const blendDeck = (deck: VotingDeck) => {
    let newDeck = { ...deck };
    newDeck.cards = newDeck.cards.sort(() => Math.random() - 0.5);
    return newDeck;
  };

  useEffect(() => {
    const newD = blendedDecks.map((deck) => blendDeck(deck));
    setBlendedDecks(newD);
    console.log(blendedDecks);
  }, []);

  const handleVote = async (vote: VoteType, cardID: number) => {
    console.log(`Card: ${cardID} was ${vote}d by ${user.firstName}`);
    const nextIndexCalc =
      activeIndex + 1 <= blendedDecks.length - 1 ? activeIndex + 1 : 0;
    console.log(`Length of the deck:  ${blendedDecks[0].cards.length}`);
    console.log(`Active Index: ${activeIndex}`);
    setNextIndex(nextIndexCalc);
    setActiveIndex(nextIndex);

    // TODO: Verify this endpoint
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
        <div className="card-group" data-status="active">
          {blendedDecks[activeIndex].cards.map((card) => (
            <div className="big-card item-card" key={card.id}>
              <ItemCard
                title={card.title}
                description={card.content}
                photoURL={card.photoURL}
                handleVote={handleVote}
                id={card.id}
              ></ItemCard>
            </div>
          ))}
        </div>
        <div className="card-group" data-status="unknown">
          {blendedDecks[activeIndex].cards.map((card) => (
            <div className="big-card item-card" key={card.id}>
              <ItemCard
                title={card.title}
                description={card.content}
                photoURL={card.photoURL}
                handleVote={handleVote}
                id={card.id}
              ></ItemCard>
            </div>
          ))}
        </div>
      </div>
      <div>
        <PickItem handleVote={handleVote} id={1}></PickItem>
      </div>
    </div>
  );
};
