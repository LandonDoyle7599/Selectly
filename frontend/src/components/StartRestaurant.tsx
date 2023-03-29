import { LoadingButton } from "@mui/lab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Card,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { Genres, Services } from "../enums";
import { useApi } from "../hooks/useApi";
import { User, VotingDeck } from "../models";
import { TestVoting } from "../pages/TestVoting";
import { primaryColor, secondaryColor } from "../styles/FormStyle";
import {
  formikTextFieldNumberProps,
  formikTextFieldProps,
  removeLeadingUnderscoresAndConvertToIntArray,
} from "../utils/helperFunctions";

export const StartRestaurant: FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<User[]>();
  const [votingDeck, setVotingDeck] = useState<VotingDeck>();
  const [showVoting, setShowVoting] = useState(false);

  useEffect(() => {
    api.get("friends/").then((res) => {
      if (res.friends) {
        setFriends(res.friends);
      }
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      quantity: 0,
      zip: 0,
      friends: [],
    },
    validationSchema: yup.object({
      title: yup.string().required("Required"),
      quantity: yup.number().required("Required"),
      zip: yup.number().required("Required"),
      friends: yup.array().min(1).required("Required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setError(null);
      api
        .post("decks/restaurants", {
          title: values.title,
          zipcode: values.zip,
          quantity: values.quantity,
          friends: values.friends,
        })
        .then((res) => {
          if (!res.message) {
            setVotingDeck(res);
            navigate("/vote", { state: { votingDeck: res } });
          } else {
            setError(res.message);
          }
        })
        .then(() => setSubmitting(false));
    },
  });

  return (
    <Stack
      sx={{
        width: "100%",
        height: "90vh",
        justifyItems: "center",
        alignItems: "center",
        alignContent: "center",
      }}
      justifyContent="center"
      alignItems={"center"}
    >
      <Card elevation={1} style={{width:400, padding:10}}>
      <Stack direction="row" spacing={5} >
          <ArrowBackIcon
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          />
          <Typography mt={3} variant="h5">
            Start Deciding a Movie
          </Typography>
        </Stack>
        <Stack direction="column" spacing={2}>
          <TextField
            {...formikTextFieldProps(formik, "title", "Title")}
            label="Title"
            variant="outlined"
          />
          <TextField
            {...formikTextFieldNumberProps(formik, "quantity", "Quantity")}
            label="Quantity"
            variant="outlined"
          />
          <TextField
            {...formikTextFieldNumberProps(formik, "zip", "Zip Code")}
            label="Zip Code"
            variant="outlined"
          />
          <FormControl sx={{ m: 1, mt: 3 }}>
            <Select
              multiple
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <Typography>Friends</Typography>;
                }
                let names = "";
                selected.forEach((id) => {
                  const friend = friends?.find((f) => f.id === id);
                  if (friend) {
                    names += `${friend.firstName} ${friend.lastName}, `;
                  }
                });
                names = names.substring(0, names.length - 2);
                return names;
              }}
              value={formik.values.friends}
              onChange={(e) => formik.setFieldValue("friends", e.target.value)}
              input={<OutlinedInput />}
            >
              {friends?.map((friend, i) => (
                <MenuItem key={i} value={friend.id}>
                  {friend.firstName} {friend.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LoadingButton
            loading={formik.isSubmitting}
            variant="contained"
            onClick={formik.submitForm}
            sx={{
              backgroundColor: primaryColor,
              ":hover": {
                backgroundColor: secondaryColor,
              },
            }}
          >
            Start
          </LoadingButton>
        </Stack>
      </Card>
    </Stack>
  );
};
