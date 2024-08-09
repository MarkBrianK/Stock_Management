import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddOrderForm() {
  const [orderData, setOrderData] = useState({
    order_date: "",
    status: "",
    product_id: "",
    quantity: "",
    price: ""
  });
  const [products, setProducts] = useState([]);
  const [productPrice, setProductPrice] = useState(0);
  const [productStock, setProductStock] = useState(0); // Track product stock
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stockError, setStockError] = useState(null); // Track stock errors
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/products');
        setProducts(response.data);
        const initialProduct = response.data.find(product => product.id === parseInt(orderData.product_id));
        if (initialProduct) {
          setProductPrice(initialProduct.price);
          setProductStock(initialProduct.stock_level); // Set initial stock level
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
      }
    };

    fetchProducts();
  }, [orderData.product_id]);

  useEffect(() => {
    if (orderData.quantity && productPrice) {
      // Calculate total price and ensure it is an integer
      const totalPrice = Math.round(orderData.quantity * productPrice);
      setOrderData(prevData => ({
        ...prevData,
        price: totalPrice
      }));
    }
  }, [orderData.quantity, productPrice]);

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === "product_id") {
      const selectedProduct = products.find(product => product.id === parseInt(value));
      if (selectedProduct) {
        setProductPrice(selectedProduct.price);
        setProductStock(selectedProduct.stock_level); // Update stock level
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if quantity exceeds stock level
    if (orderData.quantity > productStock) {
      setStockError('Quantity exceeds available stock.');
      setLoading(false);
      return;
    }

    setStockError(null); // Clear stock error if valid

    try {
      await axios.post("http://127.0.0.1:3000/orders", {
        order: {
          order_date: orderData.order_date,
          status: orderData.status,
          user_id: currentUserId,
          product_id: orderData.product_id,
          quantity: orderData.quantity,
          price: parseInt(orderData.price) // Ensure price is an integer
        }
      });

      navigate("/orders"); // Redirect to the orders list page
    } catch (error) {
      console.error('Error adding order:', error);
      setError('Error adding order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4">Add Order</Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {stockError && <Alert severity="error">{stockError}</Alert>} {/* Display stock error */}
      <form onSubmit={handleSubmit}>
        <Typography variant="h5">Order Details</Typography>
        <TextField
          label="Order Date"
          name="order_date"
          type="date"
          value={orderData.order_date}
          onChange={handleOrderChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Status"
          name="status"
          value={orderData.status}
          onChange={handleOrderChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel shrink>Product</InputLabel>
          <Select
            name="product_id"
            value={orderData.product_id}
            onChange={handleOrderChange}
            displayEmpty
          >
            <MenuItem value="" disabled>Select a product</MenuItem>
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={orderData.quantity}
          onChange={handleOrderChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={orderData.price}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Add Order
        </Button>
      </form>
    </div>
  );
}

export default AddOrderForm;
