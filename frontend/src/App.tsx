import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { Vote } from "./components/Vote";
import { ApiContext } from "./contexts/api";
import { Api } from "./lib/api";
import CreateAccount from "./pages/CreateAccount";
import { CreateDeck } from "./pages/CreateDeck";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { StartVote } from "./pages/StartVote";
const router = createBrowserRouter([
  {
    path: "/",
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
        path: "startVoting",
        element: <StartVote />,
      },

      {
        path: "",
        element: <Home />,
      },
    ],
  },
]);

export const App = () => {
  const [api, setApi] = useState(new Api());

  return (
    <>
      <ApiContext.Provider value={api}>
        <RouterProvider router={router} />
      </ApiContext.Provider>
    </>
  );
};
