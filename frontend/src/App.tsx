import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AccountIcon } from "./components/AccountIcon";
import { ApiContext } from "./contexts/api";
import { Api } from "./lib/api";
import CreateAccount from "./pages/CreateAccount";
import { CreateDeck } from "./pages/CreateDeck";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { StartVote } from "./pages/StartVote";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Results } from "./pages/Results";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6a1b9a",
    },
    secondary: {
      main: "#ab47bc",
    },
    background: {
      default: "#e1bee7",
    },
  },
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
    h2: {
      fontWeight: 700,
      fontSize: "3rem",
      lineHeight: 1.2,
      color: "#6a1b9a",
      marginBottom: "1rem",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1.5rem",
      lineHeight: 1.5,
      color: "#444",
      marginBottom: "1rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <AccountIcon />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "create-account",
        element: <CreateAccount />,
      },
      {
        path: "results",
        element: <Results/>
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "createDeck",
        element: <CreateDeck />,
      },
      {
        path: "startvote/:type",
        element: <StartVote />,
      },

      {
        path: "",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);

export const App = () => {
  const [api, setApi] = useState(new Api());

  return (
    <>
      <ThemeProvider theme={theme}>
        <ApiContext.Provider value={api}>
          <RouterProvider router={router} />
        </ApiContext.Provider>
      </ThemeProvider>
    </>
  );
};
