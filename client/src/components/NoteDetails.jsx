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
  }, [noteId, accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handleClose = () => {
    navigate("/app");
  };

  return (
    <div className="note-details">
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <button onClick={handleClose}>Close</button>
    </div>
  );
}

export default NoteDetails;