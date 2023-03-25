import { Button } from '@mui/material';
import Stack from '@mui/material/Stack/Stack';
import React, { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StartCustom } from '../components/StartCustom';
import { StartMovie } from '../components/StartMovie';
import { StartRestaurant } from '../components/StartRestaurant';



export const StartVote: FC = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    
    useEffect(() => {
        console.log(type)
    }, [type])
    
    return(
        <Stack sx={{maxWidth:"100vw", maxHeight:"100vh"}}>
            {type==="movie"&&<StartMovie/>}
            {type==="restaurant"&&<StartRestaurant/>}
            {type==="custom"&&<StartCustom/>}
        </Stack>
    );
};