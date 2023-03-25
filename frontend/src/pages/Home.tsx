import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { validateAuth } from "../hooks/checkAuth";
import { useStyles } from "../styles/FormStyle";

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
