import { Box, Dialog, Typography } from "@material-ui/core";
import { Button, Modal, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Stack } from "@mui/system";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useApi } from "../hooks/useApi";
import { FriendRequest, User } from "../models";
import { buttonSx } from "../styles/FormStyle";
import { formikTextFieldProps } from "../utils/helperFunctions";

export const Profile: FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const api = useApi();
  const [user, setUser] = useState<User>();
  const [friends, setFriends] = useState<User[]>();
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>(
    []
  );
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<
    FriendRequest[]
  >([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [friendsEmail, setFriendsEmail] = useState<string>("");
  const [openUpdateUser, setOpenUpdateUser] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      firstName: yup.string().required("Required"),
      lastName: yup.string().required("Required"),
      email: yup.string().email().required("Required"),
      password: yup.string().required("Required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setError(null);
      api
        .post("users/", {
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          email: values.email,
        })
        .then((res) => {
          if (res.token) {
            window.localStorage.setItem("token", res.token);
          } else {
            setError(res.message);
          }
        })
        .then(() => setSubmitting(false));
    },
  });

  useEffect(() => {
    try {
      api.get("users/me").then((res) => {
        if (res.user) {
          setUser(res);
          formik.resetForm({
            values: {
              firstName: res.user.firstName,
              lastName: res.user.lastName,
              email: res.user.email,
              password: res.user.password,
            },
          });
        } else {
          throw new Error(res.message);
        }
      });
      api.get("friends/outgoing").then((res) => {
        if (res.friendRequests) {
          res.friendRequests.length > 0
            ? setSentFriendRequests(res.friendRequests)
            : setSentFriendRequests([]);
        } else {
          throw new Error(res.message);
        }
      });
      api.get("friends/incoming").then((res) => {
        if (res.friendRequests) {
          res.friendRequests.length > 0
            ? setReceivedFriendRequests(res.friendRequests)
            : setReceivedFriendRequests([]);
        } else {
          throw new Error(res.message);
        }
      });
      api.get("friends").then((res) => {
        if (res.friends) {
          res.friends.length > 0 ? setFriends(res.friends) : setFriends([]);
        } else {
          throw new Error(res.message);
        }
      });
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  if (error) {
    return <h1>{error}</h1>;
  }

  const acceptFriendRequest = (friendRequest: FriendRequest) => {
    api
      .post("friends/response", {
        friendRequestId: friendRequest.id,
        response: "accepted",
      })
      .then((res) => {
        if (res.friendRequest) {
          setReceivedFriendRequests(
            receivedFriendRequests?.filter((fr) => fr.id !== friendRequest.id)
          );
          setFriends(friends?.concat(friendRequest.sender));
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const declineFriendRequest = (friendRequest: FriendRequest) => {
    api
      .post("friends/response", {
        friendRequestId: friendRequest.id,
        response: "declined",
      })
      .then((res) => {
        if (res.friendRequest) {
          setReceivedFriendRequests(
            receivedFriendRequests?.filter((fr) => fr.id !== friendRequest.id)
          );
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const cancelFriendRequest = (friendRequest: FriendRequest) => {
    api
      .post("friends/cancel", { friendRequestId: friendRequest.id })
      .then((res) => {
        if (res.friendRequest) {
          setSentFriendRequests(
            sentFriendRequests?.filter((fr) => fr.id !== friendRequest.id)
          );
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const unfriend = (friend: User) => {
    api
      .post("friends/unfriend", { friendId: friend.id })
      .then((res) => {
        if (res.friend) {
          setFriends(friends?.filter((f) => f.id !== friend.id));
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const sendFriendRequest = () => {
    api
      .post("friends/invite", { friendEmail: friendsEmail })
      .then((res) => {
        if (res.friendRequest) {
          setSentFriendRequests(sentFriendRequests?.concat(res.friendRequest));
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleClose = () => {
    setOpenUpdateUser(false);
  };

  return (
    <>
      <Stack direction={"column"} spacing={2} alignItems="center">
        <Typography variant="h2">Profile</Typography>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Send Friend Request
        </Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Stack
            direction={"column"}
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.palette.background.paper,
              padding: theme.spacing(4),
            }}
          >
            <Typography variant="h2">Send Friend Request</Typography>
            <TextField
              label="Email"
              variant="outlined"
              value={friendsEmail}
              onChange={(e) => setFriendsEmail(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendFriendRequest}
            >
              Send
            </Button>
          </Stack>
        </Modal>
        <Typography variant="h3">Update Account Info</Typography>

        <Button sx={buttonSx}>Update Account Info</Button>

        <Dialog open={openUpdateUser}>
          <Typography variant="h3">Update Account Info</Typography>
          <TextField
            {...formikTextFieldProps(formik, "firstName", "First Name")}
            variant="outlined"
          />
          <TextField
            {...formikTextFieldProps(formik, "lastName", "Last Name")}
            variant="outlined"
          />
          <TextField
            {...formikTextFieldProps(formik, "email", "Email")}
            variant="outlined"
            disabled
          />
          <TextField
            {...formikTextFieldProps(formik, "password", "Password")}
            type="password"
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!formik.dirty}
            onClick={() => formik.handleSubmit()}
          >
            Save
          </Button>
        </Dialog>
        <Typography variant="h3">Friends</Typography>
        <h2>Friends</h2>
        {friends?.map((friend) => {
          return (
            <Stack direction={"row"}>
              <h3>
                {friend.firstName} {friend.lastName}
              </h3>
              <Button onClick={() => unfriend(friend)}>Remove Friend</Button>
            </Stack>
          );
        })}
        <h2>Sent Friend Requests</h2>
        {sentFriendRequests?.map((friendRequest) => {
          return (
            <Stack direction={"row"}>
              <h3>
                {friendRequest.receiver.firstName}{" "}
                {friendRequest.receiver.lastName}
              </h3>
              <Button onClick={() => cancelFriendRequest(friendRequest)}>
                Cancel
              </Button>
            </Stack>
          );
        })}
        <Box sx={{ width: "100%", mt: 4 }}>
          <Typography variant="h3">Friends</Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h5">Friends</Typography>
            {friends?.map((friend) => (
              <Box
                key={friend.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                  p: 2,
                  mt: 2,
                }}
              >
                <Typography variant="body1">
                  {friend.firstName} {friend.lastName}
                </Typography>
                <Button variant="outlined" onClick={() => unfriend(friend)}>
                  Remove Friend
                </Button>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Sent Friend Requests</Typography>
            {sentFriendRequests?.map((friendRequest) => (
              <Box
                key={friendRequest.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                  p: 2,
                  mt: 2,
                }}
              >
                <Typography variant="body1">
                  {friendRequest.receiver.firstName}{" "}
                  {friendRequest.receiver.lastName}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => cancelFriendRequest(friendRequest)}
                >
                  Cancel
                </Button>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Friend Requests</Typography>
            {receivedFriendRequests?.map((friendRequest) => (
              <Box
                key={friendRequest.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                  p: 2,
                  mt: 2,
                }}
              >
                <Typography variant="body1">
                  {friendRequest.sender.firstName}{" "}
                  {friendRequest.sender.lastName}
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <Button
                    variant="outlined"
                    onClick={() => acceptFriendRequest(friendRequest)}
                    sx={{ mr: 1 }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => declineFriendRequest(friendRequest)}
                  >
                    Decline
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>
    </>
  );
};
