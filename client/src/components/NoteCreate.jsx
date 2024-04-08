import React, { useState } from "react";
import axios from "axios";
import { useAuthToken } from "../AuthTokenContext";
import { Container, Typography, TextField, Button, Box, Grid, FormControlLabel, Checkbox } from "@mui/material";

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
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default NoteCreate;