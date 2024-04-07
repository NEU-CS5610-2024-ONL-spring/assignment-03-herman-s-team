import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthToken } from "../AuthTokenContext";

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
      <h2>My Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <button onClick={() => setSelectedNote(note)}>{note.title}</button>
          </li>
        ))}
      </ul>
      {selectedNote && (
        <div className="note-details">
          <h3>{selectedNote.title}</h3>
          <p>{selectedNote.content}</p>
          <button onClick={() => setSelectedNote(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default NoteList;