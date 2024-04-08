import React, { useEffect, useState } from "react";
import { useParams,useNavigate  } from "react-router-dom";
import axios from "axios";
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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNote(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch note");
        setLoading(false);
      }
    };

    fetchNote();

    const checkFavorite = async () => {
        try {
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
      };
  
      checkFavorite()



  }, [noteId, accessToken]);

  
  const toggleFavorite = async () => {
    try {
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