import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";

function BrandingOverview() {
  const [brandingData, setBrandingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrandingData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/branding'); // Adjust the endpoint as needed
        setBrandingData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching branding data:', error);
        setError('Error fetching branding data');
        setLoading(false);
      }
    };

    fetchBrandingData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const totalEngagement = brandingData.reduce((acc, item) => acc + item.engagement, 0); // Adjust the data structure as needed

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Total Engagement</Typography>
        <Typography variant="h4">{totalEngagement}</Typography>
      </CardContent>
    </Card>
  );
}

export default BrandingOverview;
