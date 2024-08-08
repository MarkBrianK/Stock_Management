import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
  Button,
  Box
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function OrderList() {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editOrderData, setEditOrderData] = useState({});
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/orders/${id}`);
      setOrdersData((prevData) => prevData.filter((order) => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Error deleting order');
    }
  };

  const handleEditClick = (order) => {
    setEditOrderId(order.id);
    setEditOrderData({
      ...order
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOrderData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://127.0.0.1:3000/orders/${editOrderId}`, editOrderData);
      setOrdersData(prevData => prevData.map(order => order.id === editOrderId ? editOrderData : order));
      setEditOrderId(null);
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Error updating order');
    }
  };

  const handleAddOrder = () => {
    navigate("/add-order");
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleAddOrder} style={{ marginBottom: 16, marginTop: "10px" }}>
        Add Order
      </Button>
      {ordersData.length === 0 ? (
        <Typography>No orders available.</Typography>
      ) : (
        <List>
          {ordersData.map((order) => (
            <ListItem key={order.id} divider>
              {editOrderId === order.id ? (
                <>
                  <TextField
                    label="Order Date"
                    name="order_date"
                    type="date"
                    value={editOrderData.order_date.split('T')[0]} // format for date input
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Status"
                    name="status"
                    value={editOrderData.status}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Product ID"
                    name="product_id"
                    type="number"
                    value={editOrderData.product_id || ''}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={editOrderData.quantity || ''}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={editOrderData.price || ''}
                    onChange={handleEditChange}
                    fullWidth
                    margin="normal"
                  />
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <ListItemText
                    primary={`Order ID: ${order.id}`}
                    secondary={`Date: ${new Date(order.order_date).toLocaleDateString()}, Status: ${order.status}`}
                  />
                  <IconButton onClick={() => handleEditClick(order)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(order.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default OrderList;
