import { Button } from '@mui/material';
import React, { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StartMovie } from '../components/StartMovie';



export const StartVote: FC = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    
    return(
        <div>
            {type==="movie"&&<StartMovie/>}
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
    );
};