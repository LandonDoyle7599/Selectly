import {
  Button,
  Card as MCard,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router";
import { useApi } from "../hooks/useApi";
import { Card, CustomDeck } from "../models";
import { buttonSx } from "../styles/FormStyle";

export interface partialCard {
  title: string;
  content: string;
}

export interface partialDeck {
  title: string;
  type: string;
  cards: partialCard[];
}

export const CreateDeck: FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [deckType, setDeckType] = useState<string>();
  const [deckName, setDeckName] = useState<string>();
  const [cards, setCards] = useState<partialCard[]>([]);
  const [cardTitle, setCardTitle] = useState<string>();
  const [cardContent, setCardContent] = useState<string>();
  const [open, setOpen] = useState(false);

  const createDeck = async () => {
    let deck: partialDeck = {
      title: deckName ? deckName : "Untitled",
      type: deckType ? deckType : "No Type",
      cards: cards ? cards : [],
    };
    const res = await api.post("decks/custom", deck);
    if (res) {
      console.log("Created the deck");
      navigate("/dashboard");
    }
  };

  const openCardDialog = () => {
    setOpen(true);
  };

  const addCard = () => {
    if (!cardTitle || !cardContent) return;
    else {
      const newCard = { title: cardTitle, content: cardContent };
      setCards([...cards, newCard]);
    }
  };

  type currentCardProps = {
    cards: partialCard[];
  };
  function CurrentCards(props: currentCardProps) {
    const { cards } = props;
    if (cards.length === 0) return <></>;
    return (
      <MCard
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Current Cards Added
          </Typography>
          {cards.map((card) => (
            <MCard
              sx={{
                borderRadius: "12px",
              }}
            >
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body1" component="p">
                  {card.content}
                </Typography>
              </CardContent>
            </MCard>
          ))}
        </CardContent>
      </MCard>
    );
  }

  return (
    <MCard>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Card Information
      </Typography>

      <Stack
        direction="column"
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        marginTop={4}
        spacing={2}
      >
        <TextField
          label="Card Title"
          variant="outlined"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
        />
        <TextField
          label="Card Content"
          variant="outlined"
          value={cardContent}
          onChange={(e) => setCardContent(e.target.value)}
        />
        <Button variant="contained" onClick={() => addCard()} sx={buttonSx}>
          Add Card
        </Button>
      </Stack>
      {CurrentCards({ cards })}
      <Stack
        direction="column"
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        spacing={2}
        marginTop={4}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {" "}
          Deck Information
        </Typography>
        <TextField
          label="Deck Name"
          variant="outlined"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
        <TextField
          label="Deck Type"
          variant="outlined"
          value={deckType}
          onChange={(e) => setDeckType(e.target.value)}
        />

        <Button variant="contained" onClick={() => createDeck()} sx={buttonSx}>
          Create Deck
        </Button>
      </Stack>
    </MCard>
  );
};
