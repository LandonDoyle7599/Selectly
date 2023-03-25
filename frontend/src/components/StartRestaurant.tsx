import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Select, MenuItem, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useApi } from "../hooks/useApi";
import { Services, Genres } from "../enums";
import { formikTextFieldNumberProps, formikTextFieldProps, removeLeadingUnderscoresAndConvertToIntArray } from "../utils/helperFunctions";
import { User, VotingDeck } from "../models";
import { TestVoting } from "../pages/TestVoting";
export const StartMovie: FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<User[]>();
  const [votingDeck, setVotingDeck] = useState<VotingDeck>();
  const [showVoting, setShowVoting] = useState(false);


  useEffect(() => {
    api.get("friends/").then((res) => {
        if(res.friends){
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
        zip: values.zip,
          quantity: values.quantity,
          friends: values.friends,
        })
        .then((res) => {
            if(!res.message){
                setVotingDeck(res);
                setShowVoting(true);
            }
            else{
                setError(res.message);
            }
        })
        .then(() => setSubmitting(false));
    },
  });

    if(showVoting && votingDeck){
        return <TestVoting votingDeck={votingDeck}/>
    }


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
      <TextField {...formikTextFieldProps(formik, "zip", "Zip Code")} label="Outlined" variant="outlined"/>
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
        <Button variant="contained" onClick={formik.submitForm}>Submit</Button>
    </div>
  );
};
