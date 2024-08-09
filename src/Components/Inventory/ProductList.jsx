import React, { useState, useEffect } from "react";
import axios from "axios";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restockAmount, setRestockAmount] = useState({});
  const [newCost, setNewCost] = useState({});
  const [newPrice, setNewPrice] = useState({});
  const [showRestock, setShowRestock] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/products');
        setProductData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Error fetching product data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/products/${id}`);
      setProductData(productData.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error deleting product');
    }
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleRestock = async (id) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:3000/products/${id}/restock`, {
        restock_amount: restockAmount[id] || 0,
        cost: newCost[id] || 0,
        price: newPrice[id] || 0
      });
      setProductData(productData.map(product =>
        product.id === id ? response.data : product
      ));
      setRestockAmount({ ...restockAmount, [id]: '' });
      setNewCost({ ...newCost, [id]: '' });
      setNewPrice({ ...newPrice, [id]: '' });

      // Navigate to the expense page after successful restock
      navigate('/expenses');
    } catch (error) {
      console.error('Error restocking product:', error);
      setError('Error restocking product');
    }
  };

  const handleRestockChange = (id, field, value) => {
    if (field === 'amount') {
      setRestockAmount({ ...restockAmount, [id]: value });
    } else if (field === 'cost') {
      setNewCost({ ...newCost, [id]: value });
    } else if (field === 'price') {
      setNewPrice({ ...newPrice, [id]: value });
    }
  };

  const toggleRestockVisibility = (id) => {
    setShowRestock(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const LOW_STOCK_THRESHOLD = 10;

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddProduct}
        style={{ marginBottom: '16px', marginTop: '10px' }}
      >
        Add Product
      </Button>
      {productData.length === 0 ? (
        <Typography>No products available.</Typography>
      ) : (
        <List>
          {productData.map((product) => {
            const isOutOfStock = product.stock_level < LOW_STOCK_THRESHOLD;

            return (
              <ListItem key={product.id} divider>
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      {product.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">Description: {product.description}</Typography>
                      <Typography variant="body2">Price: ${product.price}</Typography>
                      <Typography variant="body2">
                        Stock: {product.stock_level}
                        {isOutOfStock && (
                          <Alert severity="error" style={{ display: 'inline', marginLeft: '10px' }}>
                            Low Stock
                          </Alert>
                        )}
                      </Typography>
                    </>
                  }
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    onClick={() => toggleRestockVisibility(product.id)}
                    style={{ marginRight: '10px' }}
                  >
                    {showRestock[product.id] ? 'Close' : 'Restock'}
                  </Button>
                  {showRestock[product.id] && (
                    <>
                      <TextField
                        label="Restock Amount"
                        type="number"
                        value={restockAmount[product.id] || ''}
                        onChange={(e) => handleRestockChange(product.id, 'amount', e.target.value)}
                        margin="dense"
                        style={{ width: '100px', marginRight: '10px' }}
                      />
                      <TextField
                        label="New Cost"
                        type="number"
                        value={newCost[product.id] || ''}
                        onChange={(e) => handleRestockChange(product.id, 'cost', e.target.value)}
                        margin="dense"
                        style={{ width: '100px', marginRight: '10px' }}
                      />
                      <TextField
                        label="New Price"
                        type="number"
                        value={newPrice[product.id] || ''}
                        onChange={(e) => handleRestockChange(product.id, 'price', e.target.value)}
                        margin="dense"
                        style={{ width: '100px', marginRight: '10px' }}
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRestock(product.id)}
                        style={{ marginTop: '8px', marginRight: '10px' }}
                      >
                        Restock
                      </Button>
                    </>
                  )}
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(product.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
}

export default ProductList;
