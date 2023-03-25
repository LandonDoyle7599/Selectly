import { Card, CardActionArea, CardMedia, CardContent, Typography, Icon } from '@material-ui/core';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Stack } from '@mui/material';
import React, {FC} from "react";
import { useNavigate } from 'react-router-dom';
import { primaryColor } from '../styles/FormStyle';

export const AddCustomDeck: FC = () => {
    const navigate = useNavigate();

    return (
        <Card style={{ maxWidth: 345, minHeight:138 }} onClick={() => navigate("/createDeck")}>
        <CardContent>
            <Icon>
                <AddCircleIcon fontSize='large'/>
            </Icon>
            <Stack sx={{justifyContent:"center", alignItems:"center"}}>
            <Typography variant="h5" component="h2">
                Create a Custom Deck
            </Typography>
            </Stack>
        </CardContent>
    </Card>
    )
}