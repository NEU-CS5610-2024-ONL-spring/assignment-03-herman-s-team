import React, { useState } from "react";
import axios from "axios";
import { useAuthToken } from "../AuthTokenContext";

function NoteCreate() {
  const { accessToken } = useAuthToken();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/notes`,
        { title, content, isPublic },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTitle("");
      setContent("");
      setIsPublic(false);
      setError(null);
    } catch (error) {
      setError("Failed to create note");
    }
  };

  return (
    <div className="note-create">
      <h2>Create a New Note</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <label>
          Public:
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </label>
        <button type="submit">Create</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default NoteCreate;