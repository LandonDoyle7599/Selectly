import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Button, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, Popover, Popper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateAuth } from "../hooks/checkAuth";
import "../styles/dashboard.css";
import { useApi } from "../hooks/useApi";
import { VotingDeck } from "../models";
import { TestVoting } from "./TestVoting";
import { MovieCard } from "../components/MovieCard";
import { RestaurantCard } from "../components/RestaurantCard";


export const Dashboard: FC = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);



  const [votingDeck, setVotingDeck] = useState<VotingDeck[]>();
  const api = useApi();
  const navigate = useNavigate();
  validateAuth();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  useEffect(() => {
    console.log('here')
    api.get("decks/waiting/me").then((res) => {
        if(!res.message){
        setVotingDeck(res);
        console.log(res)
        }
    });
    }, []);

    if(open && votingDeck !== undefined){
        return <TestVoting votingDeck={votingDeck[0]}/>
    }



  return (
    <Stack sx={{ width: "100vw", height: "100vh" }} direction="column">
      <Card
        sx={{
          p: 2,
          m: 4,
          width: "70%",
        }}
      >
        <Button className="button-dash" onClick={() => navigate("/profile")}>
          Profile
        </Button>
        <Button className="button-dash" onClick={() => navigate("/history")}>
          History
        </Button>
        <Button className="button-dash" onClick={() => navigate("/createDeck")}>
          Deck creation
        </Button>
      </Card>
      <h1>Decks</h1>
        <Grid item xs={12} sm={6} md={4} spacing={1}>
            <MovieCard/>
            <RestaurantCard/>
      </Grid>
      <h1>Pending Votes</h1>
      {votingDeck !== undefined && (
        <Grid item xs={12} sm={6} md={4} spacing={1}>
            <Card sx={{ maxWidth: 345 }} onClick={() => setOpen(true)}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image="/static/images/cards/contemplative-reptile.jpg"
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {votingDeck[0]?.title}
                            </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
        )}
    </Stack>
  );
};
