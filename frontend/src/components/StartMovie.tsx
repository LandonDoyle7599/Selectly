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
      <Card elevation={1} style={{ width: 400, padding: 10 }}>
        <Stack direction="row" spacing={5} >
          <ArrowBackIcon
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          />
          <Typography mt={3} variant="h5">
            Start Deciding a Movie
          </Typography>
        </Stack>
        <Stack direction="column" spacing={2} paddingTop={2}>
          <TextField
            {...formikTextFieldProps(formik, "title", "Title")}
            variant="outlined"
          />
          <TextField
            {...formikTextFieldNumberProps(formik, "quantity", "Quantity")}
            variant="outlined"
          />
          <FormControl sx={{ m: 1, mt: 3 }}>
            <Select
              multiple
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <Typography>Services</Typography>;
                }
                let names = "";
                selected.forEach((key) => {
                  names += `${Services[key]}, `;
                });
                names = names.substring(0, names.length - 2);
                return names;
              }}
              value={formik.values.services}
              onChange={(e) => formik.setFieldValue("services", e.target.value)}
              input={<OutlinedInput />}
            >
              {Object.entries(Services).map(([key, value], i) => (
                <MenuItem key={i} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, mt: 3 }}>
            <Select
              multiple
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <Typography>Genres</Typography>;
                }
                let names = "";
                selected.forEach((key) => {
                  names += `${Genres[key]}, `;
                });
                names = names.substring(0, names.length - 2);
                return names;
              }}
              value={formik.values.genres}
              onChange={(e) => formik.setFieldValue("genres", e.target.value)}
              input={<OutlinedInput />}
            >
              {Object.entries(Genres).map(([key, value], i) => (
                <MenuItem key={i} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
