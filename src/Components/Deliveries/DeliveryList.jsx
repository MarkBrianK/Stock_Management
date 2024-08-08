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
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function DeliveryList() {
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/deliveries");
        setDeliveryData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching deliveries data");
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  const handleEdit = (delivery) => {
    setEditingId(delivery.id);
    setEditValues({
      address: delivery.address || "",
      delivery_date: delivery.delivery_date
        ? new Date(delivery.delivery_date).toISOString().split("T")[0]
        : "",
      status: delivery.status || "",
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:3000/deliveries/${id}`, editValues);
      setDeliveryData((prevData) =>
        prevData.map((delivery) =>
          delivery.id === id ? { ...delivery, ...editValues } : delivery
        )
      );
      setEditingId(null);
    } catch (error) {
      setError("Error updating delivery");
    }
  };

  const handleCancel = () => setEditingId(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/deliveries/${id}`);
      setDeliveryData((prevData) =>
        prevData.filter((delivery) => delivery.id !== id)
      );
    } catch (error) {
      setError("Error deleting delivery");
    }
  };

  const handleAddDelivery = () => navigate("/add-delivery");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box padding={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddDelivery}
        style={{ marginBottom: 16 }}
      >
        Add Delivery
      </Button>
      {deliveryData.length === 0 ? (
        <Typography>No deliveries available.</Typography>
      ) : (
        <List>
          {deliveryData.map((delivery) => (
            <ListItem key={delivery.id}>
              {editingId === delivery.id ? (
                <Box display="flex" flexDirection="column" width="100%">
                  <TextField
                    label="Address"
                    name="address"
                    value={editValues.address}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    label="Delivery Date"
                    name="delivery_date"
                    type="date"
                    value={editValues.delivery_date}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    label="Status"
                    name="status"
                    value={editValues.status}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <Box display="flex" justifyContent="flex-end" marginTop={1}>
                    <IconButton
                      onClick={() => handleSave(delivery.id)}
                      color="primary"
                    >
                      <Save />
                    </IconButton>
                    <IconButton onClick={handleCancel} color="default">
                      <Cancel />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box width="100%">
                  <ListItemText
                    primary={delivery.address || "No Address"}
                    secondary={`Scheduled Date: ${new Date(
                      delivery.scheduled_date
                    ).toLocaleDateString()} - Delivery Date: ${
                      delivery.delivery_date
                        ? new Date(delivery.delivery_date).toLocaleDateString()
                        : "Not Delivered"
                    } - Status: ${delivery.status || "Not Delivered"}`}
                  />
                  <IconButton
                    onClick={() => handleEdit(delivery)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(delivery.id)}
                    color="secondary"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default DeliveryList;
