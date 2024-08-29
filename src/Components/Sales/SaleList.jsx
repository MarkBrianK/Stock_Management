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
        console.error('Error fetching sales data:', error);
        setError('Error fetching sales data');
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
    const date = new Date(dateString);
    return date.toLocaleString('en-KE', {
      timeZone: 'Africa/Nairobi',
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
      {salesData.length === 0 ? (
        <Typography>No sales available.</Typography>
      ) : (
        <>
          <Typography variant="h4">Sales List</Typography>
          <List>
            {sortedSalesData.map((sale) => {

              return (
                <ListItem key={sale.id} divider>
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        Sale: {sale.id}
                      </Typography>
                    }
                    secondary={
                      <div>
                        <Typography variant="body2">
                          Product: {sale.product ? sale.product.name : 'No product info'}
                        </Typography>
                        <Typography variant="body2">
                          User: {sale.user ? sale.user.username : 'No user info'}
                        </Typography>
                        <Typography variant="body2">Quantity: {sale.quantity}</Typography>
                        <Typography variant="body2">
                          Commission: {sale.commission ? `Ksh ${sale.commission}` : 'No commission info'}
                        </Typography>
                        <Typography variant="body2">
                          Final Price: {sale.final_price ? `Ksh ${sale.final_price}` : 'No final price info'}
                        </Typography>
                        <Typography variant="body2">
                          Date: {sale.sale_date ? formatDateToEAT(sale.sale_date) : 'No date info'}
                        </Typography>
                      </div>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </>
      )}
    </div>
  );
}

export default SaleList;
