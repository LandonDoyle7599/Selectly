import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Typography, Button } from "@material-ui/core"
import { useAuth } from "../hooks/useAuth";

export const Home: React.FC = () => {
 const navigate = useNavigate()

 useEffect(() => {
  if(window.localStorage.getItem("token") !== "" && window.localStorage.getItem("token") !== null){
    navigate("/dashboard", { replace: true })
  }
 }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "16px" }}>
      <Typography variant="h2" style={{ marginBottom: "16px" }}>
                Welcome to our Reptile Tracker web application!
      </Typography>
      <Typography variant="body1" style={{ marginBottom: "16px" }}>
        Our application is designed to help reptile owners track the health, feeding, and other important information about their beloved pets.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/login")} color="primary" style={{ marginTop: "16px" }}>
        Login
      </Button>
      <Button variant="contained" onClick={() => navigate("/create-account")} color="primary" style={{ marginTop: "16px" }}>
        Create Account
      </Button>
    </div>
  );
};

export default Home