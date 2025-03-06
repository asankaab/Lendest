import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { addUser, editData, signIn, editProfile } from './actions.jsx'

import App from './App.jsx'
import Content from './Content.jsx'
import Dashboard from './Dashboard.jsx'
import Login from './Login.jsx'
import Profile from './Profile.jsx'
import EditProfile from './EditProfile.jsx'
import AddUser from './AddUser.jsx'
import ErrorElement from './ErrorElement.jsx'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import Signup from './Signup.jsx'

const theme = createTheme({
  palette: {
  blue: {
    main: '#004ede',
    light: '#26beff',
    dark: '#06005b',
    none: '#ffffff00',
  },
  none: {
    main: '#ffffff00'
  }
},
  typography: {
    fontFamily: ['Archivo']
  },
});

theme.typography.h4 = {
  fontSize: '1.2rem',
  fontWeight: '500',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.2rem',
  },
}
theme.typography.superscript = {
  fontSize: '0.5rem',
  fontWeight: '500',
  '@media (min-width:600px)': {
    fontSize: '0.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '0.8rem',
  },
}
theme.typography.subtitle1 = {
  fontSize: '0.8rem'
}

const router = createBrowserRouter([
                  {
                  path: "/",
                  element: <App />,
                  errorElement: <ErrorElement />,
                  children: [
                    {
                      index: true,
                      errorElement: <ErrorElement />,
                      element: <Dashboard />,
                    },
                    {
                      path: "login",
                      errorElement: <ErrorElement />,
                      element: <Login />,
                      action: signIn,
                    },
                    {
                      path: "signup",
                      element: <Signup />,
                      action: signIn
                    },
                    {
                      path: ":id",
                      element: <Content />,
                      errorElement: <ErrorElement />,
                      action: editData
                    },
                    {
                      path: "profile",
                      element: <Profile />,
                      action: signIn,
                    },
                    {
                      path: "profile/edit",
                      element: <EditProfile />,
                      action: editProfile
                    },
                    {
                      path: "adduser",
                      element: <AddUser />,
                      errorElement: <ErrorElement />,
                      action: addUser
                    }
                            ]
                  }
                ], {
                  future: {
                    v7_relativeSplatPath: true,
                    v7_startTransition: true,
                    v7_fetcherPersist: true,
                    v7_normalizeFormMethod: true,
                    v7_partialHydration: true,
                    v7_skipActionErrorRevalidation: true,
                    
                  },
                })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)
