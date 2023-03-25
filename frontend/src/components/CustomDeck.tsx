import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { VotingDeck } from "../models";

export interface CustomDeckProps {
    title: string;
    nav: string
}

export const CustomDeck = (props: CustomDeckProps) => {
    const navigate = useNavigate();

    //function to generate subtle shades of purple
    const generateColor = (i: number) => {
        const color = 255 - (i * 10);
        return `rgb(${color}, ${color}, 255)`;
    }

    return (
        <Card color={generateColor(9)} sx={{ maxWidth: 345 }} onClick={() => navigate(`/startvote/custom/${props.nav}`)}>
            <CardActionArea>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {props.title}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}