import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Typography, CircularProgress, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function DeliveryList() {
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/deliveries');
        setDeliveryData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deliveries data:', error);
        setError('Error fetching deliveries data');
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-delivery/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/deliveries/${id}`);
      setDeliveryData((prevData) => prevData.filter((delivery) => delivery.id !== id));
    } catch (error) {
      console.error('Error deleting delivery:', error);
      setError('Error deleting delivery');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (deliveryData.length === 0) return <Typography>No deliveries available.</Typography>;

  return (
    <List>
      {deliveryData.map((delivery) => (
        <ListItem key={delivery.id}>
          <ListItemText primary={delivery.address} />
          <IconButton onClick={() => handleEdit(delivery.id)} color="primary">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(delivery.id)} color="secondary">
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}

export default DeliveryList;
