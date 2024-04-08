import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Link } from "react-router-dom";
import logo from '../assets/images/myj.png'; 
import bgImage from '../assets/images/bg1.jpg'; // 确保这里的路径正确
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  IconButton,
  CardMedia,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import '../css/style.css'; // 导入 CSS 文件

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [publicNotes, setPublicNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    const intervalId = setInterval(fetchPublicNotes, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  const filteredNotes = publicNotes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
<AppBar position="fixed" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}  style={{zIndex: 3 }} >
        <Toolbar sx={{ height: 150 }}>
          <img src={logo} alt="Logo" style={{ height: 90, marginLeft: 20}} />
          <Box sx={{ flexGrow: 1 }} />
          {!isAuthenticated ? (
            <>
              <Button color="inherit" onClick={loginWithRedirect}>
                Login
              </Button>
              <Button color="inherit" onClick={signUp}>
                Create Account
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/app")}>
              Enter App
            </Button>
          )}
        </Toolbar>
      </AppBar>
    
      <div className="home-container">
        <div className="header-container" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="overlay" />
          <div className="header-content">
<h1 style={{ fontFamily:'roboto'}}>      My Journal
    </h1>
<h3 style={{ fontFamily:'roboto'}}> This is a place where we share our thoughts, experiences, and stories with the world. </h3>
  <h3 style={{ fontFamily:'roboto'}}>Feel free to explore and discover the notes that resonate with you.
   </h3>       
  </div>
  </div>
  
  <div className="content-container">
  
  <Grid container justifyContent="center">
    <Grid item xs={12} sm={8} md={6}>
      <Box my={4}>
        <TextField
          label="Search Notes"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Grid>
  </Grid>
      <Grid container spacing={4}>
        {filteredNotes.map((note) => (
          <Grid item key={note.id} xs={12} sm={12} md={12} style={{ display: 'flex', justifyContent: 'center' }}>

            <Card style={{width:'80%'}}>
              <CardMedia
                height="140"
                alt={note.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {note.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {note.content.substring(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" component={Link} to={`/public/notes/${note.id}`}>
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

    </div>
  </div>
    </>

  );
}