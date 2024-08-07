import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddDeliveryForm() {
  const [deliveryData, setDeliveryData] = useState({
    order_id: "", // Ensure the delivery is associated with an order
    scheduled_date: "",
    delivery_date: "",
    status: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    return deliveryData.order_id && deliveryData.scheduled_date;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Order ID and Scheduled Date are required.");
      return;
    }
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
    <div>
      <Typography variant="h4">Add Delivery</Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Order ID"
          name="order_id"
          value={deliveryData.order_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Scheduled Date"
          name="scheduled_date"
          type="date"
          value={deliveryData.scheduled_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Delivery Date"
          name="delivery_date"
          type="date"
          value={deliveryData.delivery_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Status"
          name="status"
          value={deliveryData.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Add Delivery
        </Button>
      </form>
    </div>
  );
}

export default AddDeliveryForm;
