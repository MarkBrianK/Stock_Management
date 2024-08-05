import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    cost: "",
    stock_level: "",
    category: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/products/${id}`);
        setProductData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Error fetching product data");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:3000/products/${id}`, productData);
      navigate("/products"); // Replace history.push with navigate
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Error updating product");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4">Edit Product</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={productData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={productData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={productData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cost"
          name="cost"
          type="number"
          value={productData.cost}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Stock Level"
          name="stock_level"
          type="number"
          value={productData.stock_level}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Category"
          name="category"
          value={productData.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>
    </div>
  );
}

export default EditProduct;
