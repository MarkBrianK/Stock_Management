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
    status: "", // Payment status
    product_id: "",
    quantity: "",
    selling_price: "" // Selling price per unit
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
    if (orderData.selling_price && orderData.quantity) {
      // Calculate total price and commission based on selling price
      const totalSellingPrice = Math.round(orderData.quantity * orderData.selling_price);
      const basePrice = Math.round(orderData.quantity * productPrice);
      const commission = totalSellingPrice - basePrice;
      setOrderData(prevData => ({
        ...prevData,
        price: basePrice,
        commission: commission.toFixed(2), // Adding commission to order data
        final_price: totalSellingPrice.toFixed(2) // Adding final price to order data
      }));
    }
  }, [orderData.selling_price, orderData.quantity, productPrice]);

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
          status: orderData.status, // Send payment status
          user_id: currentUserId,
          product_id: orderData.product_id,
          quantity: orderData.quantity,
          price: parseFloat(orderData.price), // Sending the base price
          commission: parseFloat(orderData.commission), // Send commission
          final_price: parseFloat(orderData.final_price) // Send final price
        }
      });

      navigate("/sales"); // Redirect to the orders list page
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
        <FormControl fullWidth margin="normal">
          <InputLabel shrink>Status</InputLabel>
          <Select
            name="status"
            value={orderData.status}
            onChange={handleOrderChange}
            displayEmpty
          >
            <MenuItem value="" disabled>Select payment status</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="not_paid">Not Paid</MenuItem>
          </Select>
        </FormControl>
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
          label="Selling Price"
          name="selling_price"
          type="number"
          value={orderData.selling_price}
          onChange={handleOrderChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Commission"
          name="commission"
          type="number"
          value={orderData.commission || ''}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Final Price"
          name="final_price"
          type="number"
          value={orderData.final_price || ''}
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
