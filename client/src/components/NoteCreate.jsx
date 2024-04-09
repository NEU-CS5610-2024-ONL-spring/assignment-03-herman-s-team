import React, { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

function NoteCreate() {
  const { accessToken } = useAuthToken();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/"); // 使用 ipapi.co IP Geolocation API
        if (!res.ok) {
          throw new Error("Failed to fetch location");
        }
        const data = await res.json();
        setLocation({
          country: data.country_name,
          city: data.city,
        });
      } catch (error) {
        console.error("Failed to fetch location:", error);
      }
    };
    fetchLocation();
  }, []);


  const validateData = () => {
    if (title.trim() === "") {
      setError("Title cannot be empty");
      return false;
    }
    if (content.trim() === "") {
      setError("Content cannot be empty");
      return false;
    }
    return true;
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateData()) {
        return;
      }  

    try {

      const res = await fetch(`${process.env.REACT_APP_API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, content, isPublic }),
      });
      if (!res.ok) {
        throw new Error("Failed to create note");
      }
      setTitle("");
      setContent("");
      setIsPublic(false);
      setError(null);
    } catch (error) {
      setError("Failed to create note");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create a New Note
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Content"
                fullWidth
                multiline
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                }
                label="Public"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                fullWidth
                value={location ? `${location.country}, ${location.city}` : ""}
                disabled // 可选,禁用编辑
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Box>
    </Container>
  );
}

export default NoteCreate;