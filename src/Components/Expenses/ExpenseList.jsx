import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Typography, CircularProgress, IconButton, Button, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function ExpenseList() {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/expenses');
        setExpenseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses data:', error);
        setError('Error fetching expenses data');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-expense/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/expenses/${id}`);
      setExpenseData((prevData) => prevData.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('Error deleting expense');
    }
  };

  const handleAddExpense = () => {
    navigate("/add-expense");
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box padding={3}>
      <Button variant="contained" color="primary" onClick={handleAddExpense} style={{ marginBottom: 16 }}>
        Add Expense
      </Button>
      {expenseData.length === 0 ? (
        <Typography>No expenses available.</Typography>
      ) : (
        <List>
          {expenseData.map((expense) => (
            <ListItem key={expense.id}>
              <ListItemText primary={expense.description} secondary={`Amount: ${expense.amount}`} />
              <IconButton onClick={() => handleEdit(expense.id)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(expense.id)} color="secondary">
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default ExpenseList;
