import { Button, Modal, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import * as yup from "yup";
import { FriendRequest, User } from "../models";
import { formikTextFieldProps } from "../utils/helperFunctions";

export const Profile: FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [user, setUser] = useState<User>();
  const [friends, setFriends] = useState<User[]>();
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>(
    []
  );
  const [pendingFriendRequests, setPendingFriendRequests] = useState<
    FriendRequest[]
  >([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataChanged, setDataChanged] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: user ? user.firstName : "",
      lastName: user ? user.lastName : "",
      email: user ? user.email : "",
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
          formik.values["firstName"] = res.user.firstName;
          formik.values["lastName"] = res.user.lastName;
          formik.values["email"] = res.user.email;
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
            ? setPendingFriendRequests(res.friendRequests)
            : setPendingFriendRequests([]);
        } else {
          throw new Error(res.message);
        }
      });
      // api.get("friends").then
      //     ((res) => {
      //         if(res.users){
      //         setFriends(res);}else{
      //             throw new Error(res.message);
      //         }
      //     })
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  if (error) {
    return <h1>{error}</h1>;
  }

  const save = () => {
    api
      .put("users/me", {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.email,
        password: formik.values.password,
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
      .put("friends/accept", { friendRequestId: friendRequest.id })
      .then((res) => {
        if (res.friendRequest) {
          setPendingFriendRequests(
            pendingFriendRequests?.filter((fr) => fr.id !== friendRequest.id)
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
      .put("friends/decline", { friendRequestId: friendRequest.id })
      .then((res) => {
        if (res.friendRequest) {
          setPendingFriendRequests(
            pendingFriendRequests?.filter((fr) => fr.id !== friendRequest.id)
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
      .put("friends/cancel", { friendRequestId: friendRequest.id })
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
      .put("friends/unfriend", { friendId: friend.id })
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
      .post("friends/invite", { friendEmail: formik.values.email })
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
          <h2>Send Friend Request</h2>
          <TextField label="Email" variant="outlined" />
          <Button onClick={sendFriendRequest}>Send</Button>
        </Stack>
      </Modal>
      <h2>Account Info</h2>
      <TextField
        value={formik.values["firstName"]}
        onChange={() => {
          formik.handleChange;
          setDataChanged(true);
        }}
        error={formik.touched["firstName"] && !!formik.errors["firstName"]}
        label="First Name"
        variant="outlined"
      />
      <TextField
        value={formik.values["lastName"]}
        onChange={() => {
          formik.handleChange;
          setDataChanged(true);
        }}
        error={formik.touched["lastName"] && !!formik.errors["lastName"]}
        label="Last Name"
        variant="outlined"
      />
      <TextField
        value={formik.values["email"]}
        onChange={() => {
          formik.handleChange;
          setDataChanged(true);
        }}
        error={formik.touched["email"] && !!formik.errors["email"]}
        label="Email"
        variant="outlined"
      />
      <TextField
        value={formik.values["password"]}
        onChange={() => {
          formik.handleChange;
          setDataChanged(true);
        }}
        error={formik.touched["password"] && !!formik.errors["password"]}
        label="Password"
        variant="outlined"
      />
      <Button disabled={!dataChanged} onChange={save}>
        Save
      </Button>
      <h2>Friends</h2>
      {friends?.map((friend) => {
        return (
          <Stack direction={"row"}>
            <h3>
              {friend.firstName} {friend.lastName}
            </h3>
            <Button>Remove Friend</Button>
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
            <Button>Cancel</Button>
          </Stack>
        );
      })}
      <h2>Friend Requests</h2>
      {pendingFriendRequests?.map((friendRequest) => {
        return (
          <Stack direction={"row"}>
            <h3>
              {friendRequest.receiver.firstName}{" "}
              {friendRequest.receiver.lastName}
            </h3>
            <Button>Accept</Button>
            <Button>Decline</Button>
          </Stack>
        );
      })}
    </Stack>
  );
};
