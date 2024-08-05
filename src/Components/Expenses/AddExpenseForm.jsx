import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddExpenseForm() {
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: "",
    date: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:3000/expenses", expenseData);
      navigate("/expenses"); // Redirect to the expenses list page
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Error adding expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4">Add Expense</Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Description"
          name="description"
          value={expenseData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={expenseData.amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={expenseData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Add Expense
        </Button>
      </form>
    </div>
  );
}

export default AddExpenseForm;
