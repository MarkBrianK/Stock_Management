import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";

function ProfitOverview() {
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const salesResponse = await axios.get('http://127.0.0.1:3000/sales'); // Adjust the endpoint as needed
        setSalesData(salesResponse.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError('Error fetching sales data');
        setLoading(false);
      }
    };

    const fetchExpensesData = async () => {
      try {
        const expensesResponse = await axios.get('http://127.0.0.1:3000/expenses'); // Adjust the endpoint as needed
        setExpensesData(expensesResponse.data);
      } catch (error) {
        console.error('Error fetching expenses data:', error);
        setError('Error fetching expenses data');
        setLoading(false);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchSalesData(), fetchExpensesData()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const totalSales = salesData.reduce((acc, sale) => acc + sale.amount, 0); // Adjust the data structure as needed
  const totalExpenses = expensesData.reduce((acc, expense) => acc + expense.amount, 0); // Adjust the data structure as needed
  const totalProfit = totalSales - totalExpenses;

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
