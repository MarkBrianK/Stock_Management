import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, Box, Paper } from "@mui/material";

function DeliveryDetails() {
  const { id } = useParams();
  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/deliveries/${id}`);
        setDeliveryData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching delivery data:', error);
        setError('Error fetching delivery data');
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!deliveryData) return <Typography>No delivery data available.</Typography>;

  return (
    <Box padding={3}>
      <Paper elevation={3} style={{ padding: 16 }}>
        <Typography variant="h4" gutterBottom>
          Delivery Details
        </Typography>
        <Typography variant="h6">Delivery ID: {deliveryData.id}</Typography>
        <Typography variant="body1" paragraph>
          <strong>Address:</strong> {deliveryData.address}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Delivery Date:</strong> {new Date(deliveryData.delivery_date).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Status:</strong> {deliveryData.status}
        </Typography>
        {/* Add more details as needed */}
      </Paper>
    </Box>
  );
}

export default DeliveryDetails;
