import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';

import NotFound from "./components/NotFound";
import Home from "./components/Home";
import VerifyUser from "./components/VerifyUser";
import AppLayout from "./components/AppLayout";
import Profile from "./components/Profile";
import NoteCreate from "./components/NoteCreate";
import NoteList from "./components/NoteList";
import NoteDetails from "./components/NoteDetails";
import PublicNoteDetails from "./components/PublicNoteDetails";
import AuthDebugger from "./components/AuthDebugger";

import theme from "./theme";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

const requestedScopes = ["profile", "email"];


function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  
  // If the user is not authenticated, redirect to the home page
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, display the children (the protected page)
  return children;
}


root.render(

  <React.StrictMode>
      <ThemeProvider theme={theme}>
      <CssBaseline />

    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/public/notes/:noteId" element={<PublicNoteDetails />} />

            <Route
              path="app"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >

              <Route index element={<NoteList />} />
              <Route path="profile" element={<Profile />} />
              <Route path="create" element={<NoteCreate />} />
              <Route path="details/:noteId" element={<NoteDetails />} />
              <Route path="debugger" element={<AuthDebugger />} />

            </Route>
          </Routes>
        
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>

  </ThemeProvider>

  </React.StrictMode>

);
