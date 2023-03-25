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
import { handleVoteProps, VoteType } from "./Vote";

export type CardProps = {
  title: string;
  description: string;
  photoURL: string | null;
  id: number;
  handleVote: (vote: VoteType, cardID: number) => void;
};

export const ItemCard = (props: CardProps) => {
  validateAuth();

  const { title, description, photoURL, id, handleVote } = props;
  return (
    <Stack>
      <Card>
        <CardMedia
          sx={{ height: "100%" }}
          image={photoURL ? photoURL : " "}
          title={title}
        />
        <CardContent>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body1">{description}</Typography>
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
    </Stack>
  );
};
