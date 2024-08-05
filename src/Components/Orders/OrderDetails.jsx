import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress } from "@mui/material";

function OrderDetails() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/orders/${id}`);
        setOrderData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order data:', error);
        setError('Error fetching order data');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!orderData) return <Typography>No order data available.</Typography>;

  return (
    <div>
      <Typography variant="h4">Order Details</Typography>
      <Typography variant="h6">Order ID: {orderData.id}</Typography>
      <Typography variant="body1">Customer Name: {orderData.customer_name}</Typography>
      <Typography variant="body1">Order Date: {new Date(orderData.order_date).toLocaleDateString()}</Typography>
      <Typography variant="body1">Total Amount: ${orderData.total_amount}</Typography>
      <Typography variant="body1">Status: {orderData.status}</Typography>
      {/* Add more details as needed */}
    </div>
  );
}

export default OrderDetails;
