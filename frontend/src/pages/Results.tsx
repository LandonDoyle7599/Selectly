import { Button, Divider, Typography } from "@material-ui/core";
import { useTheme } from "@mui/material/styles";
import { Stack } from "@mui/material";
import React, {FC, useEffect, useState} from "react";
import { CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { VotingDeck } from "../models";
import { getCardVotes } from "../utils/helperFunctions";

export interface ResultState{
    results: VotingDeck
    id: number
}

export const Results: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [votingResults, setVotingResults] = useState<VotingDeck>();
    const api = useApi();
    const [open, setOpen] = useState(false);
    const theme = useTheme();

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
            <Stack sx={{justifyContent:"center", alignItems:"center", width:"100vw", height:"100vh"}}>
                <Typography variant="h2">Results</Typography>
                <Typography variant="h5" style={{paddingBottom:4}}>Waiting for your friends to finish voting...</Typography>
                <Button variant="text" style={{marginBottom:20}} color="primary" onClick={() => navigate("/dashboard")}>Return to the dashboard while you wait</Button>
                <CircularProgress/>
            </Stack>
        )
    }
    
    return (
        <Stack sx={{justifyContent:"center", alignItems:"center", width:"100vw", height:"100vh"}}>
        <Typography variant="h1">Results</Typography>
        <Typography variant="body1">Here are the results of your voting deck</Typography>
            {Object.entries(getCardVotes(votingResults)).map(([key, value] , i) => {
                if(i===0){
                return(
                        <Typography variant="h4">You Chose {key}</Typography>
            )
}})}
            <Button variant="outlined" onClick={() => setOpen(!open)}>Toggle full results</Button>
            {open && Object.entries(getCardVotes(votingResults)).map(([key, value], i) => {
                return(
                    <>
                        <Typography variant="body1">Option: {key}</Typography>
                        <Typography variant="body2">Votes: {value}</Typography>
                    </>
                )}
            )}  
        <Button variant="contained" onClick={() => navigate("/dashboard")}>Return to dashboard</Button>
        </Stack>
    );
    };