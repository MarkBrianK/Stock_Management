import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div style={{ width: 250 }}>
      <List>
        <ListItem button component={Link} to="/products">
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button component={Link} to="/sales">
          <ListItemText primary="Sales" />
        </ListItem>
        <ListItem button component={Link} to="/orders">
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button component={Link} to="/deliveries">
          <ListItemText primary="Deliveries" />
        </ListItem>
        <ListItem button component={Link} to="/meetings">
          <ListItemText primary="Meetings" />
        </ListItem>
        <ListItem button component={Link} to="/expenses">
          <ListItemText primary="Expenses" />
        </ListItem>
        <ListItem button component={Link} to="/users">
          <ListItemText primary="Users" />
        </ListItem>
      </List>
    </div>
  );
}

export default Sidebar;
