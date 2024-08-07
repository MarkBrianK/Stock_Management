import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Typography, CircularProgress, IconButton, Button, Box } from "@mui/material";
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

  const handleAddDelivery = () => {
    navigate("/add-delivery");
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box padding={3}>
      <Button variant="contained" color="primary" onClick={handleAddDelivery} style={{ marginBottom: 16 }}>
        Add Delivery
      </Button>
      {deliveryData.length === 0 ? (
        <Typography>No deliveries available.</Typography>
      ) : (
        <List>
          {deliveryData.map((delivery) => (
            <ListItem key={delivery.id}>
              <ListItemText
                primary={delivery.address}
                secondary={`Delivery Date: ${new Date(delivery.delivery_date).toLocaleDateString()} - Status: ${delivery.status}`}
              />
              <IconButton onClick={() => handleEdit(delivery.id)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(delivery.id)} color="secondary">
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default DeliveryList;
