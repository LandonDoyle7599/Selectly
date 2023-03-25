import { makeStyles } from "@material-ui/core/styles";

export const primaryColor = "#6a1b9a";
export const secondaryColor = "#ab47bc";
export const liteBackground = "#e1bee7";
export const buttonSx = {
  backgroundColor: primaryColor,
  ":hover": { backgroundColor: secondaryColor },
};

export const useStyles = makeStyles((theme) => ({
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
