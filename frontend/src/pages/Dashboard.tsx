import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";


export const Dashboard: FC = () => {
    const navigate = useNavigate();

    return(
        <Stack>
            <h1>Login</h1>
            <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
            <Button onClick={() => navigate("/history")}>Go to History</Button>
            <Button onClick={() => navigate("/createDeck")}>Go to deck creation</Button>
            <Button onClick={() => navigate("/startVoting")}>Go to start voting</Button>
        </Stack>
    );
};