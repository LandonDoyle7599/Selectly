import { Button, Dialog, DialogContent, Stack } from '@mui/material';
import React, {FC, useState} from 'react'
import { useNavigate } from 'react-router';
import { useApi } from '../hooks/useApi';
import { CustomDeck, Card } from "../models"

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
    const [deckType, setDeckType] = useState<string>()
    const [deckName, setDeckName] = useState<string>()
    const [cards, setCards] = useState<partialCard[]>([]);
    const [cardTitle, setCardTitle] = useState<string>()
    const [cardContent, setCardContent] = useState<string>()
    const [open, setOpen] = useState(false);

    const createDeck = async () => {
        let deck: partialDeck = {
            title: deckName ? deckName : "Untitled",
            type: deckType ? deckType : "No Type",
            cards: cards ? cards : []
        }
        await api.post("decks/custom", deck).then((res) => {
        })
    }

    const openCardDialog = () => {
        setOpen(true);
    }


        return(
            <Stack direction="column" sx={{width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center"}}>
                <input type="text" placeholder="Deck Name" onChange={(e) => setDeckName(e.target.value)}></input>
                <input type="text" placeholder="Deck Type" onChange={(e) => setDeckType(e.target.value)}></input>
                {/* //button to open dialog to add card */}
                <Button onClick={() => openCardDialog()}>Add Card</Button>
                {/* //dialog to add card */}
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogContent>
                    <Stack direction="column" sx={{width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center"}}>
                        <input type="text" placeholder="Card Title" onChange={(e) => setCardTitle(e.target.value)}></input>
                        <input type="text" placeholder="Card Content" onChange={(e) => setCardContent(e.target.value)}></input>
                        <Button onClick={() => {
                            let card: partialCard = {
                                title: cardTitle ? cardTitle : "Untitled",
                                content: cardContent? cardContent : "No Content"
                            }
                            setCards([...cards, card])
                            setOpen(false)
                        }}>Add Card</Button>
                    </Stack>
                </DialogContent>
                </Dialog>
                
                <button onClick={() => createDeck()}>Create Deck</button>
            </Stack>
        )

};