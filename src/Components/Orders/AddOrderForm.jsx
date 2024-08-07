import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddOrderForm() {
  const [orderData, setOrderData] = useState({
    customer_name: "",
    order_date: "",
    total_amount: "",
    status: "",
    delivery_id: ""  // New field for delivery
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:3000/orders", orderData);
      navigate("/orders"); // Redirect to the orders list page
    } catch (error) {
      console.error('Error adding order:', error);
      setError('Error adding order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4">Add Order</Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Customer Name"
          name="customer_name"
          value={orderData.customer_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label=""
          name="order_date"
          type="date"
          value={orderData.order_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Total Amount"
          name="total_amount"
          type="number"
          value={orderData.total_amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Status"
          name="status"
          value={orderData.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Delivery ID"  // New field for delivery
          name="delivery_id"
          value={orderData.delivery_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Add Order
        </Button>
      </form>
    </div>
  );
}

export default AddOrderForm;
