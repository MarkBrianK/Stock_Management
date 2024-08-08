import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, Button } from "@mui/material";

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

  const handleMarkDelivered = async () => {
    try {
      await axios.patch(`http://127.0.0.1:3000/orders/${id}`, { status: 'Delivered' });
      setOrderData((prev) => ({ ...prev, status: 'Delivered' }));
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Error updating order status');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!orderData) return <Typography>No order data available.</Typography>;

  return (
    <div>
      <Typography variant="h4">Order Details</Typography>
      <Typography variant="h6">Order ID: {orderData.id}</Typography>
      <Typography variant="body1">Product: {orderData.product_name}</Typography>
      <Typography variant="body1">Order Date: {new Date(orderData.order_date).toLocaleDateString()}</Typography>
      <Typography variant="body1">Quantity: {orderData.quantity}</Typography>
      <Typography variant="body1">Price: ${orderData.price}</Typography>
      <Typography variant="body1">Status: {orderData.status}</Typography>

      {orderData.delivery && (
        <div>
          <Typography variant="h6">Delivery Details</Typography>
          <Typography variant="body1">Scheduled Date: {new Date(orderData.delivery.scheduled_date).toLocaleDateString()}</Typography>
          <Typography variant="body1">Delivery Date: {new Date(orderData.delivery.delivery_date).toLocaleDateString()}</Typography>
          <Typography variant="body1">Delivery Status: {orderData.delivery.status}</Typography>
        </div>
      )}

      {orderData.status !== 'Delivered' && (
        <Button variant="contained" color="primary" onClick={handleMarkDelivered}>
          Mark as Delivered
        </Button>
      )}
    </div>
  );
}

export default OrderDetails;
