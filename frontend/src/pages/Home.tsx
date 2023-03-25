import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { validateAuth } from "../hooks/checkAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: theme.spacing(4),
  },
  heading: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: "#6a1b9a", // Purple heading color
    textAlign: "center",
  },
  text: {
    marginBottom: theme.spacing(4),
    color: "#333", // Dark gray text color
    textAlign: "center",
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: "#6a1b9a", // Purple button background color
    color: "#fff", // White button text color
    "&:hover": {
      backgroundColor: "#9c27b0", // Darker purple button background color on hover
    },
  },
}));

export const Home: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  validateAuth();

  return (
    <div className={classes.root}>
      <Typography variant="h2" className={classes.heading}>
        Welcome to Selectly!
      </Typography>
      <Typography variant="body1" className={classes.text}>
        Our application is designed to help indecisive people make decisions.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/login")}
        className={classes.button}
      >
        Login
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate("/create-account")}
        className={classes.button}
      >
        Create Account
      </Button>
    </div>
  );
};
