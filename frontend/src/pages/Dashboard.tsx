import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Popover,
  Popper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import { RestaurantCard } from "../components/RestaurantCard";
import { validateAuth } from "../hooks/checkAuth";
import { useApi } from "../hooks/useApi";
import { VotingDeck } from "../models";
import { useStyles } from "../styles/FormStyle";
import { TestVoting } from "./TestVoting";
import { CustomDeck } from "../components/CustomDeck";
import { AddCustomDeck } from "../components/AddCustomDeck";
import { useAuth } from "../hooks/useAuth";

export const Dashboard: FC = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const {token, setToken} = useAuth();

  const [votingDecks, setVotingDecks] = useState<VotingDeck[]>();
  const [customDecks, setCustomDecks] = useState<VotingDeck[]>();
  const [selectedDeck, setSelectedDeck] = useState<VotingDeck | undefined>();

  const api = useApi();
  const navigate = useNavigate();
  validateAuth();

  const logout = () => {
    setToken("");
    localStorage.clear();
    navigate("/home");
  };

  useEffect(() => {

    const interval = setInterval(() => {
      api.get("decks/waiting/me").then((res) => {
        if (!res.message) {
          setVotingDecks(res);
        }
      });

      api.get("decks/custom/all").then((res) => {
        if (!res.message) {
          setCustomDecks(res);
        }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const classes = useStyles();

  return (
    <Stack sx={{ width: "100vw", height: "100vh" }} direction="column">
      <Typography variant="h3">Decks</Typography>
      <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={4} sm={4} md={4} key={-2}>

        <MovieCard />
          </Grid>
        <Grid item xs={4} sm={4} md={4} key={-1}>

        <RestaurantCard />
        </Grid>
        {customDecks?.map((deck, i) => {
          return(
          <Grid item xs={4} sm={4} md={4} key={i}>
          <CustomDeck title={deck.title} id={deck.id} />;
          </Grid>
          )
        })}
        <Grid item xs={4} sm={4} md={4} key={-3}>
        <AddCustomDeck />
        </Grid>
      </Grid>
      <Typography variant="h3">Pending Votes</Typography>
      {votingDecks !== undefined && (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {votingDecks?.map((deck, i) => {
            return (
              <Grid item xs={4} sm={4} md={4} key={i} onClick={() => navigate("/vote", {state: {votingDeck: deck}})}>
                <Card
                    sx={{ maxWidth: 345, minHeight:130}}
                >
                  <CardActionArea>
                    <CardContent>
                      <Typography variant="h4">
                        {deck.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Stack>
  );
};
