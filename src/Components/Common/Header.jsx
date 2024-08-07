import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <div>
      <List>
        <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/products" onClick={handleDrawerToggle}>
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button component={Link} to="/sales" onClick={handleDrawerToggle}>
          <ListItemText primary="Sales" />
        </ListItem>
        <ListItem button component={Link} to="/orders" onClick={handleDrawerToggle}>
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button component={Link} to="/deliveries" onClick={handleDrawerToggle}>
          <ListItemText primary="Deliveries" />
        </ListItem>
        <ListItem button component={Link} to="/meetings" onClick={handleDrawerToggle}>
          <ListItemText primary="Meetings" />
        </ListItem>
        <ListItem button component={Link} to="/expenses" onClick={handleDrawerToggle}>
          <ListItemText primary="Expenses" />
        </ListItem>
        <ListItem button component={Link} to="/users" onClick={handleDrawerToggle}>
          <ListItemText primary="Users" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Soy United Stock System
        </Typography>
        {!isMobile && (
          <>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/products">Products</Button>
            <Button color="inherit" component={Link} to="/sales">Sales</Button>
            <Button color="inherit" component={Link} to="/orders">Orders</Button>
            <Button color="inherit" component={Link} to="/deliveries">Deliveries</Button>
            <Button color="inherit" component={Link} to="/meetings">Meetings</Button>
            <Button color="inherit" component={Link} to="/expenses">Expenses</Button>
            <Button color="inherit" component={Link} to="/users">Users</Button>
          </>
        )}
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Header;
