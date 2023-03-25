import { Button } from "@mui/material";
import { Stack } from "@mui/system"
import { FC } from "react"
import { useNavigate } from "react-router-dom";


export const Profile: FC = () => {
    const navigate = useNavigate();

return (
    <Stack>
        <h1>Profile</h1>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
    </Stack>
    );
};