import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useApi } from "../hooks/useApi";
import { Card as Alias, VotingDeck } from "../models";

export interface TestVotingProps {
  votingDeck: VotingDeck;
}

export const TestVoting: FC<TestVotingProps> = (props) => {
  const navigate = useNavigate();
  const api = useApi();
  const { votingDeck } = props;
  const [index, setIndex] = useState(0);
  const [activeCard, setActiveCard] = useState<Alias>();

  const castVote = (vote: boolean) => {
    api
      .post("vote/", {
        deckId: votingDeck.id,
        cardId: votingDeck.cards[index].id,
        vote: vote,
      })
      .then((res) => {
        console.log(res);
        if (index < votingDeck.cards.length - 1) {
          setIndex(index + 1);
        }
      });
  };

  useEffect(() => {
    setActiveCard(votingDeck.cards[index]);
  }, [index]);

  return (
    <div>
      <div>{activeCard !== undefined && <h2>{activeCard?.title}</h2>}</div>
      <Stack>
      <Card>
        <CardMedia sx={{ height: "100%" }} image={activeCard?.photoURL ? activeCard.photoURL : ""} title={activeCard?.title} />
        <CardContent>
          <Typography variant="h4">{activeCard?.title}</Typography>
          <Typography variant="body1">{activeCard?.content}</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardActions>
          <Button
            sx={{
              ":hover": {
                bgcolor: "#BDE89B",
                color: "6FC030",
              },
            }}
            size="small"
            color="primary"
            onClick={() => castVote(true)}
          >
            <ThumbUpIcon htmlColor="#6FC030" />
          </Button>
          <Button
            sx={{
              ":hover": {
                bgcolor: "#E8AD9B",
                color: "primary",
              },
            }}
            size="small"
            color="error"
            onClick={() => castVote(false)}
          >
            <ThumbDownIcon />
          </Button>
        </CardActions>
      </Card>
      </Stack>
    </div>
  );
};
