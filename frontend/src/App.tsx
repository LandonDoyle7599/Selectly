import React, { useEffect, useState } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    useLocation,
} from 'react-router-dom'
import CreateAccount from './pages/CreateAccount'
import { ApiContext } from './contexts/api'
import { Api } from './lib/api'
import { Login } from './pages/Login'
import Home from './pages/Home'
import { CreateDeck } from './pages/CreateDeck'
import { Profile } from './pages/Profile'
import { StartVote } from './pages/StartVote'
import { History } from './pages/History'
import { Dashboard } from './pages/Dashboard'
import { Demo } from './pages/Demo'

const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'create-account',
                element: <CreateAccount />,
            },
      {
        path: "vote",
        element: <Demo />,
      },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
                    {
                        path: 'profile',
                        element: <Profile/>,
                    },
                    {
                        path: 'history',
                        element: <History/>,
                    },
                    {
                        path: 'createDeck',
                        element: <CreateDeck/>,
                    },
                    {
                        path: 'startVoting',
                        element: <StartVote/>,
                    },

              {
                  path: '',
                  element: <Home/>
              }
        ],
    },
])

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
