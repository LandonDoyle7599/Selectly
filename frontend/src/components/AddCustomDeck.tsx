import { Card, CardActionArea, CardMedia, CardContent, Typography, Icon } from '@material-ui/core';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React, {FC} from "react";
import { useNavigate } from 'react-router-dom';
import { primaryColor } from '../styles/FormStyle';

export const AddCustomDeck: FC = () => {
    const navigate = useNavigate();

    return (
        <Card style={{ maxWidth: 345 }} onClick={() => navigate("/createDeck")}>
        <CardContent>
            <Icon>
                <AddCircleIcon fontSize='large' style={{backgroundColor:primaryColor}}/>
            </Icon>
        </CardContent>
    </Card>
    )
}