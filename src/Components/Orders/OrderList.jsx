import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  IconButton,
  Button,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate, } from "react-router-dom";

function OrderList() {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editOrderData, setEditOrderData] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/orders');
        setOrdersData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders data:', error);
        setError('Error fetching orders data');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/orders/${id}`);
      setOrdersData((prevData) => prevData.filter((order) => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Error deleting order');
    }
  };

  const handleEditClick = (order) => {
    setEditOrderId(order.id);
    setEditOrderData({
      ...order,
      order_details: order.order_details.map(detail => ({
        ...detail,
        product_id: detail.product.id
      }))
    });
  };

  const handleEditChange = (e, index) => {
    const { name, value } = e.target;
    setEditOrderData(prevData => ({
      ...prevData,
      order_details: prevData.order_details.map((detail, i) => i === index ? { ...detail, [name]: value } : detail)
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://127.0.0.1:3000/orders/${editOrderId}`, {
        order: editOrderData,
        order_details_attributes: editOrderData.order_details
      });
      setOrdersData(prevData => prevData.map(order => order.id === editOrderId ? editOrderData : order));
      setEditOrderId(null);
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Error updating order');
    }
  };

  const handleAddOrder = () => {
    navigate("/add-order");
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleAddOrder} style={{ marginBottom: 16, marginTop: "10px" }}>
        Add Order
      </Button>
      {ordersData.length === 0 ? (
        <Typography>No orders available.</Typography>
      ) : (
        <List>
          {ordersData.map((order) => (
            <ListItem key={order.id} divider>
              {editOrderId === order.id ? (
                <>
                  {order.order_details.map((detail, index) => (
                    <Box key={detail.id} marginBottom={2}>
                      <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={editOrderData.order_details[index].quantity}
                        onChange={(e) => handleEditChange(e, index)}
                        fullWidth
                        margin="normal"
                      />
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Product</InputLabel>
                        <Select
                          name="product_id"
                          value={editOrderData.order_details[index].product_id}
                          onChange={(e) => handleEditChange(e, index)}
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
                        label="Price"
                        name="price"
                        type="number"
                        value={editOrderData.order_details[index].price}
                        onChange={(e) => handleEditChange(e, index)}
                        fullWidth
                        margin="normal"
                      />
                    </Box>
                  ))}
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  {order.order_details.map(detail => (
                    <ListItemText
                      key={detail.id}
                      primary={`Product: ${detail.product?.name || 'No product name'}`}
                      secondary={`Quantity: ${detail.quantity}, Price: ${detail.price}`}
                    />
                  ))}

                  <IconButton onClick={() => handleEditClick(order)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(order.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default OrderList;
