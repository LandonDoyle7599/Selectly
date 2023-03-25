import { Button, Modal, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import * as yup from "yup";
import { FriendRequest, User } from "../models";
import { formikTextFieldProps } from "../utils/helperFunctions";
import { Typography } from "@material-ui/core";

export const Profile: FC = () => {
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

  const save = () => {
    api
      .post("users/update", {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.email,
        password: formik.values.password !== undefined ? formik.values.password : "",
      })
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          setDataChanged(false);
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

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

  return (
    <Stack direction={"column"}>
      <h1>Profile</h1>
      <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      <Button onClick={() => setOpen(true)}>Send Friend Request</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Stack direction={"column"}>
          <Typography variant="h1">Send Friend Request</Typography>
          <TextField
            label="Email"
            variant="outlined"
            value={friendsEmail}
            onChange={(e) => setFriendsEmail(e.target.value)}
          />
          <Button onClick={sendFriendRequest}>Send</Button>
        </Stack>
      </Modal>
      <h2>Account Info</h2>
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
      <Button disabled={!formik.dirty} onClick={save}>
        Save
      </Button>
      <h2>Friends</h2>
      {friends?.map((friend) => {
        return (
            <Stack direction={"row"}>
            <h3>{friend.firstName} {friend.lastName}</h3>
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
      <h2>Friend Requests</h2>
      {receivedFriendRequests?.map((friendRequest) => {
        return (
          <Stack direction={"row"}>
            <h3>
              {friendRequest.sender.firstName}{" "}
              {friendRequest.sender.lastName}
            </h3>
            <Button onClick={() => acceptFriendRequest(friendRequest)}>
              Accept
            </Button>
            <Button onClick={() => declineFriendRequest(friendRequest)}>
              Decline
            </Button>
          </Stack>
        );
      })}
    </Stack>
  );
};
