import React, { useEffect, useState } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { TextField, Button, Grid } from "@mui/material";
import "../css/profile.css";
import FavoriteNoteList from "./FavoriteNoteList";

function Profile() {
  const { accessToken } = useAuthToken();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState(""); // 添加了这一行

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        setUser(data);
        setName(data.name);
        setBio(data.bio || "");
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch user profile");
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, bio }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      const data = await response.json();
      setUser(data);
      setError(null);
    } catch (error) {
      setError("Failed to update user profile");
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="profile">
      <div className="profile-header">
       
        <h1 className="profile-name">{user?.name}</h1>
        <p className="profile-bio">{user?.bio}</p>
      </div>

      <div className="profile-section">
        <h2 className="profile-section-title">User Information</h2>
        <p className="profile-section-content">Email: {user?.email}</p>
        <p className="profile-section-content">
          Created At: {new Date(user?.createdAt).toLocaleDateString()}
        </p>
        <p className="profile-section-content">
          Updated At: {new Date(user?.updatedAt).toLocaleDateString()}
        </p>
        <p className="profile-section-content">Number of Notes: {user?.notesCount}</p>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Grid>
        </Grid>
      </form>

      {error && <p className="profile-error">{error}</p>}

      <div className="profile-section">
        <FavoriteNoteList />
      </div>
    </div>
  );
}
export default Profile;