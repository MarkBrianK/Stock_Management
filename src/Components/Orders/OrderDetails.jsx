import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, Button } from "@mui/material";

function OrderDetails() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/orders/${id}`);
        setOrderData(response.data);
        const deliveryResponse = await axios.get(`http://127.0.0.1:3000/deliveries/${response.data.delivery_id}`);
        setDeliveryData(deliveryResponse.data);
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
      <Typography variant="body1">Customer Name: {orderData.customer_name}</Typography>
      <Typography variant="body1">Order Date: {new Date(orderData.order_date).toLocaleDateString()}</Typography>
      <Typography variant="body1">Total Amount: ${orderData.total_amount}</Typography>
      <Typography variant="body1">Status: {orderData.status}</Typography>

      {deliveryData && (
        <div>
          <Typography variant="h6">Delivery Details</Typography>
          <Typography variant="body1">Address: {deliveryData.address}</Typography>
          <Typography variant="body1">Delivery Date: {new Date(deliveryData.delivery_date).toLocaleDateString()}</Typography>
          <Typography variant="body1">Delivery Status: {deliveryData.status}</Typography>
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
