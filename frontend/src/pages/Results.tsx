import { Button, Typography } from "@material-ui/core";
import React, {FC, useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { VotingDeck } from "../models";

export interface ResultState{
    results: VotingDeck
    id: number
}

export const Results: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [votingResults, setVotingResults] = useState<VotingDeck>();
    const api = useApi();

    //use effect that fetches results from backend every three seconds
    useEffect(() => {
        if(location.state.results !== null){
            setVotingResults(location.state.results)
            return;
        }
        const interval = setInterval(() => {
            fetchResults()
        }, 3000);
        return () => clearInterval(interval);
    }, [])

    const fetchResults = () => {
        api.get(`decks/${location.state.id}`).then((res) => {
            if(res.status === "finished"){
                setVotingResults(res)
            }
        })
    }
    

    if(!votingResults){
        return(
            <div>
                <h1>Results</h1>
                <p>Waiting for your friends to finish voting</p>
            </div>
        )
    }
    
    return (
        <div>
        <h1>Results</h1>
        <p>Here are the results of your voting deck</p>
        <div>
            {votingResults.cards.map((card) => {
                return(
                    <div>
                        <h2>{card.title}</h2>
                        <p>{card.content}</p>
                        {/* <p>Number of votes: {card.votes.length}</p> */}
                    </div>
                )
            })}
        </div>
        <Button onClick={() => navigate("/dashboard")}>Return to dashboard</Button>
        </div>
    );
    };