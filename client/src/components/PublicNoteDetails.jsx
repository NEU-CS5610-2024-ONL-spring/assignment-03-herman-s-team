import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

function PublicNoteDetails({ noteId, onClose }) {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/public/notes/${noteId}`);
        setNote(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch note");
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/favorites`, {
            params: { noteId },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setIsFavorite(response.data.length > 0);
        } catch (error) {
          console.error("Failed to check favorite", error);
        }
      }
    };

    checkFavorite();
  }, [noteId, isAuthenticated, getAccessTokenSilently]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      setOpenLoginDialog(true);
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently();
      if (isFavorite) {
        await axios.delete(`${process.env.REACT_APP_API_URL}/favorites`, {
          params: { noteId },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/favorites`, {
          noteId,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  const handleLoginDialogClose = () => {
    setOpenLoginDialog(false);
  };

  const handleLogin = () => {
    loginWithRedirect();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="note-details">
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <button onClick={toggleFavorite}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
      <button onClick={onClose}>Close</button>

      <Dialog open={openLoginDialog} onClose={handleLoginDialogClose}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          You need to log in to add this note to your favorites.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginDialogClose} color="primary">
            Close
          </Button>
          <Button onClick={handleLogin} color="primary" autoFocus>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PublicNoteDetails;