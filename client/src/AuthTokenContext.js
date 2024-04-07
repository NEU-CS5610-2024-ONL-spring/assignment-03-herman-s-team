import React, { useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthTokenContext = React.createContext();

const requestedScopes = ["profile", "email"];

function AuthTokenProvider({ children }) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [accessToken, setAccessToken] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: requestedScopes.join(" "),
          },
        });
        setAccessToken(token);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(err);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      getAccessToken();
    } else {
      setLoading(false);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  const value = { accessToken, loading, error };
  return (
    <AuthTokenContext.Provider value={value}>
      {children}
    </AuthTokenContext.Provider>
  );
}

const useAuthToken = () => useContext(AuthTokenContext);

export { useAuthToken, AuthTokenProvider };