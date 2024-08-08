import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddDeliveryForm() {
  const [deliveryData, setDeliveryData] = useState({
    order_id: "",
    scheduled_date: "",
    delivery_date: "",
    status: "",
    address: "" // Added address field
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/orders");
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:3000/deliveries", { delivery: deliveryData });
      navigate("/deliveries"); // Redirect to the deliveries list page
    } catch (error) {
      console.error('Error adding delivery:', error);
      setError('Error adding delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={3}>
      <Typography variant="h4">Add Delivery</Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="order-select-label">Order</InputLabel>
          <Select
            labelId="order-select-label"
            name="order_id"
            value={deliveryData.order_id}
            onChange={handleChange}
            required
          >
            {orders.map((order) => (
              <MenuItem key={order.id} value={order.id}>
                {`Order ID: ${order.id} - ${order.product.name} (${order.quantity})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Scheduled Date"
          name="scheduled_date"
          type="date"
          value={deliveryData.scheduled_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Delivery Date"
          name="delivery_date"
          type="date"
          value={deliveryData.delivery_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Address"
          name="address"
          value={deliveryData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        
        <TextField
          label="Status"
          name="status"
          value={deliveryData.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Add Delivery
        </Button>
      </form>
    </Box>
  );
}

export default AddDeliveryForm;
