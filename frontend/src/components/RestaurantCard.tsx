import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";


export const RestaurantCard = () => {
    const navigate = useNavigate();

    return (
        <Card sx={{ maxWidth: 345 }} onClick={() => navigate("/startvote/restaurant")}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image="https://www.solanocounty.com/images/Restaurant_19.jpg"
                        alt="restaurant"
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            Restaurants
                            </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
    )
}