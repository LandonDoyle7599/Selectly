import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";


export const History: FC = () => {
    const navigate = useNavigate();

    return(
        <Stack>
            <h1>History</h1>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </Stack>
    );
};