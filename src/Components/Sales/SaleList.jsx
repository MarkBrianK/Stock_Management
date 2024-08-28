import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Typography, CircularProgress } from "@mui/material";

function SaleList() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/sales');
        setSalesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales:', error);
        setError('Error fetching sales');
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4">Sales List</Typography>
      <List>
        {salesData.map((sale) => (
          <ListItem key={sale.id}>
            <ListItemText
              primary={`Product: ${sale.product.name}`}
              secondary={`Quantity: ${sale.quantity} | Commission: ${sale.commission} | Final Price: ${sale.final_price}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default SaleList;
