import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Container, Card, CardContent, Alert, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useFormik } from "formik";
import * as yup from "yup";
import { formikTextFieldProps } from "../utils/helperFunctions";
import { LoadingButton } from "@mui/lab";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";

export const Login: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const navigateToHome = () => {
    navigate("/dashboard");
  };

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
      api.post("users", {
        firstName: values.firstName, 
        lastName: values.lastName, 
        password: values.password, 
        email: values.email
      })
        .then((res) => {
          if (res.token) {
            window.localStorage.setItem("token", res.token);
            navigateToHome();
          } else {
            setError(res.message);
          }
        })
        .then(() => setSubmitting(false));
    },
  });

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 24 }}>
        <CardContent>
        <Stack gap="2rem" justifyContent="center">
      <Stack direction="row">
        <IconButton>
          <ArrowBackIcon onClick={navigateToHome} />
        </IconButton>
        <Typography variant="h4" align="center" width="100%" sx={{ mr: 5 }}>
          Create Account
        </Typography>
      </Stack>
      <TextField
        {...formikTextFieldProps(formik, "firstName", "First Name")}
      />
      <TextField
        {...formikTextFieldProps(formik, "lastName", "Last Name")}
      />
      <TextField
        {...formikTextFieldProps(formik, "email", "Email")}
        helperText={formik.touched.email && formik.errors.email}
      />
      <TextField
        {...formikTextFieldProps(formik, "password", "Password")}
        helperText={formik.touched.password && formik.errors.password}
        type="password"
      />

      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction="row" justifyContent="center">
        <LoadingButton
          variant="contained"
          onClick={formik.submitForm}
          loading={formik.isSubmitting}
        >
          Create Account
        </LoadingButton>
      </Stack>

      <Stack direction="row" gap="1rem" justifyContent="center">
        <Button variant="text" onClick={() => navigate("/login")} sx={{ mx: 2 }}>
          Login
        </Button>
      </Stack>
    </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
