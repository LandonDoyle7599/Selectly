import { useTheme } from "@mui/material/styles";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { validateAuth } from "../hooks/checkAuth";
import { useStyles } from "../styles/FormStyle";

export const Home: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();

  validateAuth();

  return (
    <div className={classes.root}>
      <Typography variant="h2" className={classes.heading}>
        Welcome to Selectly!
      </Typography>
      <Typography variant="body1" className={classes.text}>
        The web app to help indecisive people make decisive decisions!
      </Typography>
      <Stack direction="column" spacing={1}>
        <Button
          style={{ backgroundColor:"primary" }}
          variant="contained"
          onClick={() => navigate("/login")}
          className={classes.button}
          color="primary"
        >
          Login
        </Button>
        <Button
          color="primary"
          variant="text"
          onClick={() => navigate("/create-account")}
          className={classes.button}
        >
          Create Account
        </Button>
      </Stack>
    </div>
  );
};
