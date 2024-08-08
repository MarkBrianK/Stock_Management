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
import Alert from '@mui/material/Alert'; // Import Alert component
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

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
    navigate(`/edit-product/${id}`); // Use navigate instead of history.push
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
    navigate('/add-product'); // Redirect to the add product page
  };

  // Define a low stock threshold
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
            // Check if stock level is below the threshold
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
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(product.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(product.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
}

export default ProductList;
