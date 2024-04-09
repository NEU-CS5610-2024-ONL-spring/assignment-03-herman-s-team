import React, { useEffect, useState } from "react";
import { useParams,useNavigate  } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";

function NoteDetails() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch note');
        }
        const data = await response.json();
        setNote(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch note");
        setLoading(false);
      }
    };

    fetchNote();

    const checkFavorite = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/favorites?noteId=${noteId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to check favorite');
        }
        const data = await response.json();
        setIsFavorite(data.length > 0);
      } catch (error) {
        console.error("Failed to check favorite", error);
      }
    };

    checkFavorite();
  }, [noteId, accessToken]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/favorites?noteId=${noteId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to remove favorite');
        }
      } else {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ noteId }),
        });
        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="note-details">
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <button onClick={handleClose}>Close</button>
      <button onClick={toggleFavorite}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
}

export default NoteDetails;