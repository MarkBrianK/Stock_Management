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

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (productData.length === 0) {
    return <Typography>No products available.</Typography>;
  }

  return (
    <List>
      {productData.map((product) => (
        <ListItem key={product.id}>
          <ListItemText
            primary={
              <Typography variant="body1">
                {product.name}
              </Typography>
            }
          />
          <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(product.id)}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(product.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}

export default ProductList;
