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


export const Dashboard: FC = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);



  const [votingDeck, setVotingDeck] = useState<VotingDeck>();
  const api = useApi();
  const navigate = useNavigate();
  validateAuth();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  useEffect(() => {
    api.get("decks/waiting/me").then((res) => {
        if(!res.message){
        setVotingDeck(res);
        }
    });
    }, []);

    if(open && votingDeck){
        return <TestVoting votingDeck={votingDeck}/>
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
        <Button
          className="button-dash"
          onClick={() => navigate("/startVoting")}
        >
          Start voting
        </Button>
      </Card>
      <h1>Decks</h1>
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 345 }} onClick={() => navigate("/startvote/movie")}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image="/static/images/cards/contemplative-reptile.jpg"
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            Movies
                            </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
      </Grid>
      <h1>Pending Votes</h1>
      {votingDeck && (
        <Grid item xs={12} sm={6} md={4}>
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
                            {votingDeck.title}
                            </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
        )}
    </Stack>
  );
};
