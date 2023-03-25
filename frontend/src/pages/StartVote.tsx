import { Button } from '@mui/material';
import Stack from '@mui/material/Stack/Stack';
import React, { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StartMovie } from '../components/StartMovie';



export const StartVote: FC = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    
    return(
        <Stack sx={{maxWidth:"100vw", maxHeight:"100vh"}}>
            {type==="movie"&&<StartMovie/>}
            {type==="restaurant"&&<StartRestaurant/>}
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </Stack>
    );
};