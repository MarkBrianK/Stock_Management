import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress } from "@mui/material";

function SaleDetails() {
  const { id } = useParams();
  const [saleData, setSaleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/sales/${id}`);
        setSaleData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sale data:', error);
        setError('Error fetching sale data');
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!saleData) return <Typography>No sale data available.</Typography>;

  return (
    <div>
      <Typography variant="h4">Sale Details</Typography>
      <Typography variant="h6">Name: {saleData.name}</Typography>
      <Typography variant="body1">Description: {saleData.description}</Typography>
      <Typography variant="body1">Price: ${saleData.price}</Typography>
      <Typography variant="body1">Date: {new Date(saleData.date).toLocaleDateString()}</Typography>
      {/* Add more details as needed */}
    </div>
  );
}

export default SaleDetails;
