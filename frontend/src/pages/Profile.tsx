import { Box, Card, Dialog, Typography } from "@material-ui/core";
import { Button, Modal, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Stack } from "@mui/system";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Friends } from "../components/Friends";
import { useApi } from "../hooks/useApi";
import { FriendRequest, User } from "../models";
import { buttonSx, primaryColor, secondaryColor } from "../styles/FormStyle";
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

  const handleClose = () => {
    setOpenUpdateUser(false);
  };

  return (
    <>
      <Typography variant="h2">Profile</Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard
      </Button>

      <>
        <Typography variant="h5">
          Update Account Info
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginLeft: "10", alignItems: "right" }}
            onClick={() => setOpenUpdateUser(true)}
          >
            Update Account Info
          </Button>
        </Typography>
      </>

      <Dialog open={openUpdateUser}>
        <div style={{ backgroundColor: secondaryColor }}>
          <Typography variant="h3">Update Account Info</Typography>
          <TextField
            sx={{ margin: "15px" }}
            {...formikTextFieldProps(formik, "firstName", "First Name")}
            variant="outlined"
          />
          <TextField
            sx={{ margin: "15px" }}
            {...formikTextFieldProps(formik, "lastName", "Last Name")}
            variant="outlined"
          />

          <TextField
            sx={{ margin: "15px" }}
            {...formikTextFieldProps(formik, "password", "Password")}
            type="password"
            variant="outlined"
          />
          <Button
            sx={{
              margin: "15px",
              backgroundColor: "whitesmoke",
              boxShadow: "10",
            }}
            variant="contained"
            disabled={!formik.dirty}
            onClick={() => formik.handleSubmit()}
          >
            Save
          </Button>
        </div>
      </Dialog>
      <Card>
        <Friends></Friends>
      </Card>
    </>
  );
};
