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
        <Grid item xs={12} sm={6} md={4} spacing={1}>
            <MovieCard/>
            <RestaurantCard/>
            {
              customDecks?.map((deck) => {
                  return (
                      <CustomDeck title={deck.title} id={deck.id}/>
                  );
              })
            }
            <AddCustomDeck/>
      </Grid>
      <h1>Pending Votes</h1>
      {votingDecks !== undefined && (
        <Grid item xs={12} sm={6} md={4} spacing={1}>
            {
              votingDecks?.map((deck) => {
                  return (
                      <Card color="purple" sx={{ maxWidth: 345 }} onClick={() => setOpen(true)}>
                          <CardActionArea>
                              <CardContent>
                                  <Typography variant="body2" color="text.secondary">
                                      {deck.title}
                                  </Typography>
                              </CardContent>
                          </CardActionArea>
                      </Card>
                  );
              })
            }
        </Grid>
      )}
    </Stack>
  );
};
