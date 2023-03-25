import { Button } from '@mui/material';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';



export const StartVote: FC = () => {
    const navigate = useNavigate();
    
    return(
        <div>
            <h1>StartVote</h1>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
    );
};