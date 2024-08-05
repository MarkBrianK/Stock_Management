import React, { useState, useEffect } from "react";
import axios from "axios";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router for routing

function ProductDetails() {
  const { productId } = useParams(); // Retrieve the productId from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Error fetching product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!product) {
    return <Typography>No product found.</Typography>;
  }

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Product Details
      </Typography>
      <Divider />
      <Typography variant="h6" marginY={1}>
        Name: {product.name}
      </Typography>
      <Typography variant="body1" marginY={1}>
        Description: {product.description}
      </Typography>
      <Typography variant="body1" marginY={1}>
        Price: ${product.price}
      </Typography>
      <Typography variant="body1" marginY={1}>
        Cost: ${product.cost}
      </Typography>
      <Typography variant="body1" marginY={1}>
        Stock Level: {product.stock_level}
      </Typography>
      <Typography variant="body1" marginY={1}>
        Category: {product.category}
      </Typography>
      <Typography variant="body1" marginY={1}>
        Product ID: {product.id}
      </Typography>
    </Box>
  );
}

export default ProductDetails;
