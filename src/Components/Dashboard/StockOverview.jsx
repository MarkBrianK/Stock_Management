import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";

function StockOverview() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/products');
        setStockData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Error fetching stock data');
        setLoading(false);
      }
    };

    fetchStockData();

  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const totalStock = stockData.reduce((acc, product) => acc + product.stock_level, 0);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Total Stock Level</Typography>
        <Typography variant="h4">{totalStock}</Typography>
      </CardContent>
    </Card>
  );
}

export default StockOverview;
