import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";


export const MovieCard = () => {
    const navigate = useNavigate();

    return (
        <Card sx={{ maxWidth: 345 }} onClick={() => navigate("/startvote/movie")}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image="https://media.istockphoto.com/id/961758222/photo/bucket-of-popcorn-on-red-background.jpg?s=612x612&w=0&k=20&c=CGMULL_BPPDnucdpTog5ZIcNM2MFaQ0aqEGdJqoudBs="
                        alt="movie"
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            Movies
                            </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
    )
}