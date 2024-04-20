import React, { useEffect, useState } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function FavoriteNoteList() {
  const { accessToken } = useAuthToken();
  const [favoriteNotes, setFavoriteNotes] = useState([]);

  useEffect(() => {
    const fetchFavoriteNotes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/favoritedNotes`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorite notes");
        }

        const data = await response.json();
        setFavoriteNotes(data);
      } catch (error) {
        console.error("Failed to fetch favorite notes:", error);
      }
    };

    if (accessToken) {
      fetchFavoriteNotes();
    }
  }, [accessToken]);

  return (
    <div>
      <br></br>
      <Typography variant="h5" gutterBottom>
        Favorite Notes
      </Typography>
      {favoriteNotes.length > 0 ? (
        <List>
          {favoriteNotes.map((note) => (
            <ListItem key={note.id} component={Link} to={`/app/details/${note.id}`}>
              <ListItemText primary={note.title} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No favorite notes yet.</Typography>
      )}
    </div>
  );
}

export default FavoriteNoteList;