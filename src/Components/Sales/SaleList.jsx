import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Typography, CircularProgress, IconButton, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function SaleList() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/sales');
        setSalesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError('Error fetching sales data');
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-sale/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/sales/${id}`);
      setSalesData((prevData) => prevData.filter((sale) => sale.id !== id));
    } catch (error) {
      console.error('Error deleting sale:', error);
      setError('Error deleting sale');
    }
  };

  const handleMakeSale = () => {
    navigate('/add-sale');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleMakeSale}
        style={{ margin: '20px 0' }}
      >
        Add Sale
      </Button>
      {salesData.length === 0 ? (
        <Typography>No sales available.</Typography>
      ) : (
        <List>
          {salesData.map((sale) => (
            <ListItem key={sale.id} divider>
              <ListItemText
                primary={
                  <Typography variant="h6">
                    Sale ID: {sale.id}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2">Product ID: {sale.product_id}</Typography>
                    <Typography variant="body2">
                      User: {sale.user ? sale.user.username : 'No user info'}
                    </Typography>
                    <Typography variant="body2">Quantity: {sale.quantity}</Typography>
                    <Typography variant="body2">Total Price: ${sale.total_price}</Typography>
                    <Typography variant="body2">Date: {new Date(sale.sale_date).toLocaleDateString()}</Typography>
                  </>
                }
              />
              <IconButton onClick={() => handleEdit(sale.id)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(sale.id)} color="secondary">
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}

export default SaleList;
