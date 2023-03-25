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
import { validateAuth } from "../hooks/checkAuth";
import { useApi } from "../hooks/useApi";
import { VotingDeck } from "../models";
import { useStyles } from "../styles/FormStyle";
import { TestVoting } from "./TestVoting";
import { MovieCard } from "../components/MovieCard";
import { RestaurantCard } from "../components/RestaurantCard";
import { CustomDeck } from "../components/CustomDeck";
import { AddCustomDeck } from "../components/AddCustomDeck";

export const Dashboard: FC = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [votingDecks, setVotingDecks] = useState<VotingDeck[]>();
  const [customDecks, setCustomDecks] = useState<VotingDeck[]>();
  const [selectedDeck, setSelectedDeck] = useState<VotingDeck | undefined>();

  const api = useApi();
  const navigate = useNavigate();
  validateAuth();

  const logout = () => {
    localStorage.removeItem("token");
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
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (open && votingDecks !== undefined) {
    return <TestVoting votingDeck={votingDecks[0]} />;
  }

  if (open && votingDecks) {
    return <TestVoting votingDeck={votingDecks[0]} />;
  }

  return (
    <Stack sx={{ width: "100vw", height: "100vh" }} direction="column">
      <Card
        sx={{
          display: "flex",
          justifyContent: "align-items",
          p: 2,
          m: 4,
          backgroundColor: "primary.secondary",
        }}
      >
        <Button className="dash-button" onClick={() => navigate("/profile")}>
          Profile
        </Button>
        <Button className="dash-button" onClick={() => navigate("/history")}>
          History
        </Button>
      </Card>
      <h1>Decks</h1>
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
      <h1>Pending Votes</h1>
      {votingDecks !== undefined && (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {votingDecks?.map((deck, i) => {
            return (
              <Grid item xs={4} sm={4} md={4} key={i} onClick={() => setOpen(true)}>
                <Card
                    sx={{ maxWidth: 345, minHeight:130}}
                >
                  <CardActionArea>
                    <CardContent>
                      <Typography variant="h1">
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
