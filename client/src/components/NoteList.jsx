
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthToken } from "../AuthTokenContext";
import { Link } from "react-router-dom";
import { Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress } from "@mui/material";


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
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="123">
      <Typography variant="h5" gutterBottom>
        Notes
      </Typography>
      <Grid container spacing={4}>
        {notes.map((note) => (
          <Grid item key={note.id} xs={12} sm={12} md={12}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {note.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {note.content.substring(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/app/details/${note.id}`}>
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default NoteList;