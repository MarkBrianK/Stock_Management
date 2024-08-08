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
  FormControl
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddOrderForm() {
  const [orderData, setOrderData] = useState({
    order_date: "",
    status: "",
    product_id: "",
    quantity: "",
  });
  const [deliveryData, setDeliveryData] = useState({
    scheduled_date: "",
    delivery_date: "",
    status: "",
  });
  const [products, setProducts] = useState([]);
  const [productPrice, setProductPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      const totalPrice = orderData.quantity * productPrice;
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
      }
    }
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Submit order first
      const orderResponse = await axios.post("http://127.0.0.1:3000/orders", {
        order: {
          order_date: orderData.order_date,
          status: orderData.status,
          user_id: currentUserId,
          order_details_attributes: [
            {
              product_id: orderData.product_id,
              quantity: orderData.quantity,
              price: orderData.price
            }
          ]
        }
      });
      const orderId = orderResponse.data.id; // Assuming the response contains the order ID

      // Submit delivery details if provided
      if (deliveryData.scheduled_date || deliveryData.delivery_date || deliveryData.status) {
        await axios.post("http://127.0.0.1:3000/deliveries", {
          delivery: {
            ...deliveryData,
            order_id: orderId
          }
        });
      }

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
        />
        <TextField
          label="Status"
          name="status"
          value={orderData.status}
          onChange={handleOrderChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Product</InputLabel>
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
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={orderData.price}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
        />
        <Typography variant="h5">Delivery Details</Typography>
        <TextField
          label="Scheduled Date"
          name="scheduled_date"
          type="date"
          value={deliveryData.scheduled_date}
          onChange={handleDeliveryChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Delivery Date"
          name="delivery_date"
          type="date"
          value={deliveryData.delivery_date}
          onChange={handleDeliveryChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Delivery Status"
          name="status"
          value={deliveryData.status}
          onChange={handleDeliveryChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Add Order
        </Button>
      </form>
    </div>
  );
}

export default AddOrderForm;
