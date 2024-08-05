import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, CircularProgress } from "@mui/material";

function OrderTracking() {
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/orders/tracking');
        setTrackingData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setError('Error fetching tracking data');
        setLoading(false);
      }
    };

    fetchTracking();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (trackingData.length === 0) return <Typography>No tracking data available.</Typography>;

  return (
    <div>
      <Typography variant="h4">Order Tracking</Typography>
      {/* Render tracking data here */}
    </div>
  );
}

export default OrderTracking;
