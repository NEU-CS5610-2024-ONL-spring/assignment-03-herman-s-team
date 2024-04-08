import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import bgImage from '../assets/images/bg1.jpg';
import logo from '../assets/images/myj.png'; 

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <AppBar position="fixed" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} style={{ zIndex: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <img src={logo} alt="Logo" style={{ height: 90, marginLeft: 20,marginTop:20}} />
          </Typography>
          <Button color="inherit" component={Link} to="/app/create">
            Create
          </Button>
          <Button color="inherit" component={Link} to="/app">
            NoteList
          </Button>
          <Button color="inherit" component={Link} to="/app/profile">
            Profile
          </Button>

          <Button color="inherit" component={Link} to="/app/debugger">
            Auth Debugger
          </Button>
          <Button color="inherit" onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <div className="header-container" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="overlay" />
        <div className="header-content">
          <Typography variant="h4" gutterBottom>
            Welcome 👋 {user.name}
          </Typography>
        </div>
      </div>

      <div className="content-container">
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </div>
    </div>
  );
}