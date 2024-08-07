import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";

function SalesOverview() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/sales');
        setSalesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError('Error fetching sales data');
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  // Calculate total sales, ensuring amount is treated as a number
  const totalSales = salesData.reduce((acc, sale) => acc + (parseFloat(sale.total_price) || 0), 0);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Total Sales Amount</Typography>
        <Typography variant="h4">${totalSales.toFixed(2)}</Typography>
      </CardContent>
    </Card>
  );
}

export default SalesOverview;
