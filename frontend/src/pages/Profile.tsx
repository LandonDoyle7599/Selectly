import { Button, Modal, TextField } from "@mui/material";
import { Stack } from "@mui/system"
import { FC, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { FriendRequest, User } from "../models";


export const Profile: FC = () => {
    const navigate = useNavigate();
    const api = useApi();
    const [user, setUser] = useState<User>();
    const [friends, setFriends] = useState<User[]>();
    const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>();
    const [pendingFriendRequests, setPendingFriendRequests] = useState<FriendRequest[]>();
    const [open, setOpen] = useState(false);


    useEffect(() => {
        try{
        api.get("users/me")
            .then((res) => {
                setUser(res);
            })
        api.get("friends/outgoing").then
            (res => {   
                setSentFriendRequests(res);
            })   
        } catch (err) {

        }
    }, [])


return (
    <Stack direction={"column"}>
        <h1>Profile</h1>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        <Button onClick={() => setOpen(true)}>Send Friend Request</Button>
        <Modal open={open} onClose={() => setOpen(false)}>
            <Stack direction={"column"}>
                <h2>Send Friend Request</h2>
                <TextField label="Email" variant="outlined" />
                <Button>Send</Button>
            </Stack>
        </Modal>
        <h2>Account Info</h2>
        <TextField label="First Name" variant="outlined" />
        <TextField label="Last Name" variant="outlined" />
        <TextField label="Email" variant="outlined" />
        <TextField label="Password" variant="outlined" />
        <h2>Friends</h2>
        {friends?.map((friend) => {
            return (
                <Stack direction={"row"}>
                    <h3>{friend.firstName} {friend.lastName}</h3>
                    <Button>Remove Friend</Button>
                </Stack>
            )
        })
        }
        <h2>Sent Friend Requests</h2>
        {sentFriendRequests?.map((friendRequest) => {
            return (
                <Stack direction={"row"}>
                    <h3>{friendRequest.receiver.firstName} {friendRequest.receiver.lastName}</h3>
                    <Button>Cancel</Button>
                </Stack>
            )
        })
        }
        <h2>Friend Requests</h2>
        {pendingFriendRequests?.map((friendRequest) => {
            return (
                <Stack direction={"row"}>
                    <h3>{friendRequest.receiver.firstName} {friendRequest.receiver.lastName}</h3>
                    <Button>Accept</Button>
                    <Button>Decline</Button>
                </Stack>
            )
        })
        }
    </Stack>
    );
};