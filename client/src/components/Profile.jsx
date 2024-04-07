import React, { useEffect, useState } from "react";
import { useAuthToken } from "../AuthTokenContext";
import axios from "axios";

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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
        setName(response.data.name);
        setBio(response.data.bio || ""); // 添加了这一行，如果bio不存在则设置为空字符串
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
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/me`,
        { name,bio },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUser(response.data);
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
      <h1>User Profile</h1>
      {user ? (
        <div>
          <form onSubmit={handleSubmit}>
  <label>
    Name:
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </label>
  <label>
    Bio:
    <textarea
      value={bio}
      onChange={(e) => setBio(e.target.value)}
    />
  </label>
  <button type="submit">Update</button>
</form>
          {error && <p>{error}</p>}
          <p>Email: {user.email}</p>
          <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
          <p>Updated At: {new Date(user.updatedAt).toLocaleDateString()}</p>
          <p>Number of Notes: {user.notesCount}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}
      
    </div>
  );
}

export default Profile;