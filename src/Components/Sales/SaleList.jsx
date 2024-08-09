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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
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
                    <Typography variant="body2">
                      Product: {sale.product ? sale.product.name : 'No product info'}
                    </Typography>
                    <Typography variant="body2">
                      User: {sale.user ? sale.user.username : 'No user info'}
                    </Typography>
                    <Typography variant="body2">Quantity: {sale.quantity}</Typography>
                    <Typography variant="body2">
                      Total Price: {sale.total_price ? `$${sale.total_price}` : 'No price info'}
                    </Typography>
                    <Typography variant="body2">
                      Date: {sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'No date info'}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}

export default SaleList;
