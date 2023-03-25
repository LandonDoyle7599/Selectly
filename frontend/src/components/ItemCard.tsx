import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";
import { VoteType } from "../pages/Demo";

export type CardProps = {
  title: string;
  description: string;
  imageURL: string;
  id: number;
  handleVote: (vote: VoteType) => void;
};

// TODO: Votebox

export const ItemCard = (props: CardProps) => {
  const { title, description, imageURL, id, handleVote } = props;
  return (
    <Stack>
      <Card>
        <CardMedia
          sx={{ height: "100%" }}
          image={props.imageURL}
          title="movie"
        />
        <CardContent>
          <Typography variant="h4">{props.title}</Typography>
          <Typography variant="body1">{props.description}</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => handleVote("like")}
          >
            <ThumbUpIcon />
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleVote("dislike")}
          >
            <ThumbDownIcon />
          </Button>
          {/* error for red */}
        </CardActions>
      </Card>
    </Stack>
  );
};
