import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Typography, CircularProgress, IconButton, Button, Box } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";

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

  const handleAddOrder = () => {
    navigate("/add-order");
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleAddOrder} style={{ marginBottom: 16, marginTop:"10px" }}>
        Add Order
      </Button>
      {ordersData.length === 0 ? (
        <Typography>No orders available.</Typography>
      ) : (
        <List>
          {ordersData.map((order) => (
            <ListItem key={order.id} divider>
              <ListItemText primary={order.name} />
              <IconButton component={Link} to={`/order-details/${order.id}`} color="info">
                <Visibility />
              </IconButton>
              <IconButton onClick={() => handleEdit(order.id)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(order.id)} color="secondary">
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default OrderList;
