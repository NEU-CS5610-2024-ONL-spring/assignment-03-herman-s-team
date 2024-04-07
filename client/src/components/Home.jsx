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
    
      <div style={{ backgroundColor: '#b5b49a',   // 使用模板字符串和变量
padding: '0px', margin: '0px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',backgroundPosition: 'center' }}>
  
      <div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // 水平居中
  justifyContent: 'center', // 垂直居中
  textAlign: 'center',
  backgroundImage: `url(${bgImage})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover', 
  marginTop: '0px',
  marginBottom: '20px',
  height: '60vh', // 使用视口高度
  width: '100%', // 确保父容器宽度为100%
  alignItems: 'center',
}}> 
  <div style={{
    position: 'absolute', // 覆盖层绝对定位
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明覆盖层
    zIndex: 1, // 确保覆盖层位于内容之上
    height: '60vh', // 使用视口高度
  }} />

 <div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: 'white',
  zIndex: 2, // 确保文本内容位于覆盖层之上

}}>
<h1 style={{ fontFamily:'roboto'}}>      My Personal Journal
    </h1>
       <h3 style={{ fontFamily:'roboto'}} >Welcome to My Personal Journal</h3> 
<h3 style={{ fontFamily:'roboto'}}> This is a place where I share my thoughts, experiences, and stories with the world. </h3>
  <h3 style={{ fontFamily:'roboto'}}>Feel free to explore and discover the notes that resonate with you.
   </h3>       
  </div>
  </div>
  
  <div style={{ backgroundColor: 'white', borderRadius: '4px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',marginTop:'-80px', padding: '1rem', width: 'calc(100% - 2cm)', height: 'calc(100vh - 2cm)', display: 'flex', flexDirection: 'column',zIndex: 2 }}>
    
      <Box my={4}>
        <TextField
          label="Search Notes"
          variant="outlined"
          size="small"
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
      <Grid container spacing={4}>
        {filteredNotes.map((note) => (
          <Grid item key={note.id} xs={12} sm={6} md={4}>
            <Card>
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