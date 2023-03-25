import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateAuth } from "../hooks/checkAuth";
import "../styles/voteStyles.css";
import { handleVoteProps, VoteType } from "./Vote";

type PickItemProps = {
  handleVote: (vote: VoteType, cardID: number) => void;
  id: number;
};

export const PickItem = (props: PickItemProps) => {
  const { handleVote, id } = props;
  return (
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
          onClick={() => handleVote("like", id)}
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
          onClick={() => handleVote("dislike", id)}
        >
          <ThumbDownIcon />
        </Button>
      </CardActions>
    </Card>
  );
};
