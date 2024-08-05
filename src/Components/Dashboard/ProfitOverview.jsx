import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";

function ProfitOverview() {
  const [profitData, setProfitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/profits'); // Adjust the endpoint as needed
        setProfitData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profit data:', error);
        setError('Error fetching profit data');
        setLoading(false);
      }
    };

    fetchProfitData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const totalProfit = profitData.reduce((acc, profit) => acc + profit.amount, 0); // Adjust the data structure as needed

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Total Profit</Typography>
        <Typography variant="h4">{totalProfit}</Typography>
      </CardContent>
    </Card>
  );
}

export default ProfitOverview;
