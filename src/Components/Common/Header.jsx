import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Soy United Stock System
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/products">Products</Button>
        <Button color="inherit" component={Link} to="/sales">Sales</Button>
        <Button color="inherit" component={Link} to="/orders">Orders</Button>
        <Button color="inherit" component={Link} to="/deliveries">Deliveries</Button>
        <Button color="inherit" component={Link} to="/meetings">Meetings</Button>
        <Button color="inherit" component={Link} to="/expenses">Expenses</Button>
        <Button color="inherit" component={Link} to="/users">Users</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
