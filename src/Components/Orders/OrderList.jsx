import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Typography, CircularProgress, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function OrderList() {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/orders');
        setOrdersData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders data:', error);
        setError('Error fetching orders data');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-order/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/orders/${id}`);
      setOrdersData((prevData) => prevData.filter((order) => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Error deleting order');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (ordersData.length === 0) return <Typography>No orders available.</Typography>;

  return (
    <List>
      {ordersData.map((order) => (
        <ListItem key={order.id}>
          <ListItemText primary={order.name} />
          <IconButton onClick={() => handleEdit(order.id)} color="primary">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(order.id)} color="secondary">
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}

export default OrderList;
