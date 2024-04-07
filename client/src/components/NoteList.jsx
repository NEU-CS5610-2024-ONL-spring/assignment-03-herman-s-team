import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthToken } from "../AuthTokenContext";
import { Link } from "react-router-dom";

function NoteList() {
  const { accessToken } = useAuthToken();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/notes`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNotes(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch notes");
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchNotes();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
<div className="note-list">
      <h2>Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link to={`/app/details/${note.id}`}>{note.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoteList;