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

  // Sort sales data by sale_date (date and time) in descending order
  const sortedSalesData = salesData.slice().sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  // Formatting date to EAT (East Africa Time)
  const formatDateToEAT = (dateString) => {
    return new Date(dateString).toLocaleString('en-KE', {
      timeZone: 'Africa/Nairobi', // EAT is the time zone for Africa/Nairobi
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div>
      <Typography variant="h4">Sales List</Typography>
      <List>
        {sortedSalesData.map((sale) => (
          <ListItem key={sale.id}>
            <ListItemText
              primary={`Product: ${sale.product.name}`}
              secondary={`Quantity: ${sale.quantity} | Commission: ${sale.commission} | Final Price: ${sale.final_price} | Date: ${formatDateToEAT(sale.sale_date)}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default SaleList;
