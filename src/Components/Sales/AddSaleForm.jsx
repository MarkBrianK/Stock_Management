import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddSaleForm() {
  const [saleData, setSaleData] = useState({
    name: "",
    description: "",
    price: "",
    date: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaleData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:3000/sales", saleData);
      navigate("/sales"); // Redirect to the sales list page
    } catch (error) {
      console.error('Error adding sale:', error);
      setError('Error adding sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4">Add Sale</Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={saleData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={saleData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={saleData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={saleData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Add Sale
        </Button>
      </form>
    </div>
  );
}

export default AddSaleForm;
