import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [publicNotes, setPublicNotes] = useState([]);

  useEffect(() => {
    const fetchPublicNotes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/public/notes`);
        setPublicNotes(response.data);
      } catch (error) {
        console.error("Failed to fetch public notes:", error);
      }
    };

    fetchPublicNotes();
  }, []);

  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  return (
    <div className="home">
      <h1>TODOs App</h1>
      <div>
        {!isAuthenticated ? (
          <button className="btn-primary" onClick={loginWithRedirect}>
            Login
          </button>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/app")}>
            Enter App
          </button>
        )}
      </div>
      <div>
        <button className="btn-secondary" onClick={signUp}>
          Create Account
        </button>
      </div>
      <h2>Public Notes</h2>
      <ul>
        {publicNotes.map((note) => (
          <li key={note.id}>
            <Link to={`/public/notes/${note.id}`}>{note.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}