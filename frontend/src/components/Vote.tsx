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
  const [activeGroup, setActiveGroup] = useState(0);
  const [nextGroup, setNextGroup] = useState(1);
  const [lastGroup, setLastGroup] = useState(2);
  const [activeIndex, setActiveIndex] = useState(0);
  const [deckQueue, setDeckQueue] = useState<number[]>([
  const [blendedDecks, setBlendedDecks] = useState<VotingDeck[]>([
    deck,
    deck,
    deck,
    deck,
  ]);

  const blendDeck = (deck: VotingDeck) => {
    const numCards = Math.floor(deck.cards.length);
    const frontCards = deck.cards.filter((card) => card.id <= numCards);
    const backCards = deck.cards.filter((card) => card.id > numCards);
    const newOrder = [
      ...frontCards.map((card) => card.id),
      ...backCards.map((card) => card.id),
      ...Array.from(
        { length: deck.cards.length - numCards },
        (_, i) => i + numCards + 1
      ).reverse(),
    ];
    const newCards = newOrder.map((id) => {
      const card = deck.cards.find((c) => c.id === id);
      if (!card) return undefined;
      return {
        ...card,
        id,
      };
    });
    return {
      ...deck,
      cards: newCards.filter((card): card is Card => card !== undefined),
    };
  };

  useEffect(() => {
    const newD = blendedDecks.map((deck) => blendDeck(deck));
    setBlendedDecks(newD);
  }, []);

  const handleVote = async (vote: VoteType, cardID: number) => {
    // TODO: Verify this endpoint
    console.log(`Card: ${cardID} was ${vote}d by ${user.firstName}`);
    const nextIndex = activeIndex + 1 <= 3 - 1 ? activeIndex + 1 : 0;
    const currentGroup = document.querySelector(
        `[data-index="${activeIndex}"]`
      ),
      nextGroup = document.querySelector(`[data-index="${nextIndex}"]`);

    currentGroup.dataset.status = "after";
    nextGroup.dataset.status = "active";
    setActiveIndex(nextIndex);

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
        <div className="card-group" data-index="0" data-status="active">
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
        <div className="card-group" data-index="1" data-status="unknown">
          {deck.cards.map((card, index) => (
            <div className="big-card item-card" key={card.id}>
              {index === 1 && (
                <ItemCard
                  title={card.title}
                  description={card.content}
                  photoURL={card.photoURL}
                  handleVote={handleVote}
                  id={card.id}
                />
              )}
              {index !== 1 && (
                <ItemCard
                  title={card.title}
                  description={card.content}
                  photoURL={card.photoURL}
                  handleVote={handleVote}
                  id={card.id}
                />
              )}
            </div>
          ))}
        </div>
        <div className="card-group" data-index="2" data-status="unknown">
          {deck.cards.map((card, index) => (
            <div className="big-card item-card" key={card.id}>
              {index === 2 && (
                <ItemCard
                  title={card.title}
                  description={card.content}
                  photoURL={card.photoURL}
                  handleVote={handleVote}
                  id={card.id}
                />
              )}
              {index !== 2 && (
                <ItemCard
                  title={card.title}
                  description={card.content}
                  photoURL={card.photoURL}
                  handleVote={handleVote}
                  id={card.id}
                />
              )}
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
