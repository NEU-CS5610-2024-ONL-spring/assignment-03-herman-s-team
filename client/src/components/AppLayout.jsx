import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Toolbar, Typography, Button, Container, Drawer, List, ListItem, ListItemText, IconButton, useMediaQuery,Box,CircularProgress } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import bgImage from '../assets/images/bg1.jpg';
import logo from '../assets/images/myj.png';
import { useState } from 'react';

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth0();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  if (isLoading) {

    return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          bgcolor="background.default"
          color="text.primary"
        >
          <Box textAlign="center">
            <CircularProgress size={80} />
            <Typography variant="h5" mt={4}>
              Verifying user...
            </Typography>
          </Box>
        </Box>
      );  }

  const drawer = (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <List>
        <ListItem button component={Link} to="/app/create" onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Create" />
        </ListItem>
        <ListItem button component={Link} to="/app" onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="NoteList" />
        </ListItem>
        <ListItem button component={Link} to="/app/profile" onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button component={Link} to="/app/debugger" onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Auth Debugger" />
        </ListItem>
<ListItem button onClick={() => logout({ returnTo: 'https://assignment-03-herman-s-team-avru2vpmo-ting-fungs-projects.vercel.app' })}>
  <ListItemText primary="Logout" />
</ListItem>
      </List>
    </Drawer>
  );

  return (
    <div className="home-container">
      <AppBar position="fixed" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} style={{ zIndex: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} alt="Logo" style={{ height: 90, marginLeft: 20, marginTop: 20 }} />
          </Typography>
          {isSmallScreen ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <>
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
              <Button color="inherit" onClick={() => logout({ returnTo: "https://assignment-03-herman-s-team-avru2vpmo-ting-fungs-projects.vercel.app" })}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer 组件 */}
      {drawer}

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