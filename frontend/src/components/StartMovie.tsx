import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Select, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useApi } from "../hooks/useApi";
import { Services, Genres } from "../enums";
import { formikTextFieldNumberProps, formikTextFieldProps } from "../utils/helperFunctions";
import { User } from "../models";
export const StartMovie: FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<User[]>();


  useEffect(() => {
    api.get("users/friends").then((res) => {
        setFriends(res);
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
          genres: values.genres,
          services: values.services,
          quantity: values.quantity,
          friends: values.friends,
        })
        .then((res) => {})
        .then(() => setSubmitting(false));
    },
  });

  return (
    <div>
      <h1>StartMovie</h1>
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
      <Select
        value={formik.values.genres}
        multiple
        onChange={(e) => formik.setFieldValue("genres", e.target.value)}
        name="Genres"
        label="Genres"
      >
        {Object.entries(Genres).map(([key, value], i) => (
          <MenuItem key={i} value={key}>
            {value}
          </MenuItem>
        ))}
      </Select>
        <Select
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
    </div>
  );
};
