import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  MenuItem,
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
export const StartMovie: FC = () => {
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
      genres: [],
      services: [],
      friends: [],
    },
    validationSchema: yup.object({
      title: yup.string().required("Required"),
      quantity: yup.number().required("Required"),
      genres: yup.array().required("Required"),
      services: yup.array().required("Required"),
      friends: yup.array().min(1).required("Required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setError(null);
      api
        .post("decks/movies", {
          title: values.title,
          genres: removeLeadingUnderscoresAndConvertToIntArray(values.genres),
          services: removeLeadingUnderscoresAndConvertToIntArray(
            values.services
          ),
          quantity: values.quantity,
          friends: values.friends,
        })
        .then((res) => {
          if (!res.message) {
            setVotingDeck(res);
            setShowVoting(true);
          } else {
            setError(res.message);
          }
        })
        .then(() => setSubmitting(false));
    },
  });

  if (showVoting && votingDeck) {
    return <TestVoting votingDeck={votingDeck} />;
  }

  return (
    <Stack direction={"column"} sx={{backgroundColor: secondaryColor}}>
      <Card sx={{ width: "50%", margin: "8px", padding: "8px" }}>
        <Stack direction={"column"}>
          <h1>Select Your Movies </h1>
          <Typography mt={3} variant="h5">
            Title
          </Typography>
          <TextField
            {...formikTextFieldProps(formik, "title", "")}
            variant="outlined"
          />
          <Typography mt={3} variant="h5">
            Quantity
          </Typography>
          <TextField
            {...formikTextFieldNumberProps(formik, "quantity", "")}
            variant="outlined"
          />

          <Typography mt={3} variant="h5">
            Services
          </Typography>
          <Select
            value={formik.values.services}
            multiple
            onChange={(e) => formik.setFieldValue("services", e.target.value)}
            name="Services"
            label="Services"
          >
            {Object.entries(Services).map(([key, value], i) => (
              <MenuItem key={i} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
          <Typography mt={3} variant="h5">
            Genres
          </Typography>
          <Select
            // sx={{ backgroundColor: secondaryColor, padding: "5" }}
            value={formik.values.genres}
            multiple
            onChange={(e) => formik.setFieldValue("genres", e.target.value)}
            name="Genres"
            label="Genres"
            placeholder="Genres"
          >
            {Object.entries(Genres).map(([key, value], i) => (
              <MenuItem key={i} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
          <Typography mt={3} variant="h5">
            Friends
          </Typography>
          <Select
            // sx={{ backgroundColor: secondaryColor }}
            value={formik.values.friends}
            multiple
            onChange={(e) => formik.setFieldValue("friends", e.target.value)}
            name="Friends"
            label="Friends"
          >
            {friends?.map((friend, i) => (
              <MenuItem key={i} value={friend.id}>
                {friend.firstName} {friend.lastName}
              </MenuItem>
            ))}
          </Select>
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
            Submit
          </LoadingButton>
        </Stack>
      </Card>
    </Stack>
  );
};
