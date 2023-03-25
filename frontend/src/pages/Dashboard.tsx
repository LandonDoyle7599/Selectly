import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Button, Popper } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";


export const Dashboard: FC = () => {
    const [open , setOpen] = useState(false);
    const navigate = useNavigate();

    return(
        <Stack sx={{width:"100vw", height:"100vh"}} direction="column">
            <Stack direction="row" sx={{width:"100%", height:"10vh", backgroundColor:"primary.main", alignItems:"center", justifyContent:"space-between"}}>
                <h1 style={{color:"white", marginLeft:"2rem"}}>Dashboard</h1>
                <AccountCircleRoundedIcon id="profile" style={{color:"white", marginRight:"2rem"}} fontSize="large" onClick={() => setOpen(!open)}/>
            </Stack>
            <h1>Login</h1>
            <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
            <Button onClick={() => navigate("/history")}>Go to History</Button>
            <Button onClick={() => navigate("/createDeck")}>Go to deck creation</Button>
            <Button onClick={() => navigate("/startVoting")}>Go to start voting</Button>
            <Popper open={open} anchorEl={document.getElementById("profile")}>
                <Stack sx={{width:"10rem", height:"10rem", backgroundColor:"primary.main", alignItems:"center", justifyContent:"space-between"}}>
                    <h1 style={{color:"white"}}>Profile</h1>
                    <h1 style={{color:"white"}}>History</h1>
                    <h1 style={{color:"white"}}>Logout</h1>
                </Stack>
            </Popper>
        </Stack>
    );
};