import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, CircularProgress, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddSaleForm() {
  const [saleData, setSaleData] = useState({
    product_id: "",
    user_id: "",
    quantity: "",
    total_price: "",
    sale_date: new Date().toISOString().split('T')[0] // Set current date in YYYY-MM-DD format
  });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [productPrice, setProductPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error fetching products");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users");
      }
    };

    fetchProducts();
    fetchUsers();
  }, []);

  useEffect(() => {
    // Update total price when quantity or unit price changes
    const totalPrice = saleData.quantity * productPrice;
    setSaleData((prevData) => ({
      ...prevData,
      total_price: totalPrice
    }));
  }, [saleData.quantity, productPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaleData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // Update product price when product changes
    if (name === "product_id") {
      const selectedProduct = products.find((product) => product.id === parseInt(value));
      if (selectedProduct) {
        setProductPrice(selectedProduct.price);
      }
    }
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Product</InputLabel>
          <Select
            label="Product"
            name="product_id"
            value={saleData.product_id}
            onChange={handleChange}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>User</InputLabel>
          <Select
            label="User"
            name="user_id"
            value={saleData.user_id}
            onChange={handleChange}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={saleData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Total Price"
          name="total_price"
          type="number"
          value={saleData.total_price}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Sale Date"
          name="sale_date"
          type="date"
          value={saleData.sale_date}
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
