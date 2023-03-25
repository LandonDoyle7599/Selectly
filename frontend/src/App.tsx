import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { ApiContext } from "./contexts/api";
import { Api } from "./lib/api";
import CreateAccount from "./pages/CreateAccount";
import { Login } from "./pages/Login";
import { Demo } from "./pages/VotingPage";

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
        path: "vote",
        element: <Demo />,
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
