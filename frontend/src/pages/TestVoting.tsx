import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import { useApi } from '../hooks/useApi';
import { Card, VotingDeck } from '../models';

export interface TestVotingProps{
    votingDeck: VotingDeck;
}

export const TestVoting: FC<TestVotingProps> = (props) => {
    const navigate = useNavigate();
    const api = useApi();
    const {votingDeck} = props;
    const [index, setIndex] = useState(0);
    const [activeCard, setActiveCard] = useState<Card>();

    const castVote = (vote: boolean) => {
        api.post("vote/", {
            deckId: votingDeck.id,
            cardId: votingDeck.cards[index].id,
            vote: vote,
        }).then((res) => {
                console.log(res);
                if(index < votingDeck.cards.length - 1){
                setIndex(index + 1);
            }
        })
    }

    useEffect(() => {
        setActiveCard(votingDeck.cards[index]);
    }, [index])


    return (
        <div>
            <h1>Test Voting</h1>
            <div>
                {activeCard !== undefined &&
                <h2>{activeCard?.title}</h2>}
                </div>
                <div>
                    <Button onClick={() => castVote(true)}>Yes</Button>
                    <Button onClick={() => castVote(false)}>No</Button>
                    </div>
        </div>
    )

}