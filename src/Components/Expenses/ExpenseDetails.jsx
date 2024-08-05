import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress } from "@mui/material";

function ExpenseDetails() {
  const { id } = useParams();
  const [expenseData, setExpenseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/expenses/${id}`);
        setExpenseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expense data:', error);
        setError('Error fetching expense data');
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!expenseData) return <Typography>No expense data available.</Typography>;

  return (
    <div>
      <Typography variant="h4">Expense Details</Typography>
      <Typography variant="h6">Expense ID: {expenseData.id}</Typography>
      <Typography variant="body1">Description: {expenseData.description}</Typography>
      <Typography variant="body1">Amount: {expenseData.amount}</Typography>
      <Typography variant="body1">Date: {new Date(expenseData.date).toLocaleDateString()}</Typography>
      {/* Add more details as needed */}
    </div>
  );
}

export default ExpenseDetails;
