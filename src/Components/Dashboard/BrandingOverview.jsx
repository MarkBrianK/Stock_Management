import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function BrandingOverview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesResponse = await axios.get('http://127.0.0.1:3000/sales');
        const ordersResponse = await axios.get('http://127.0.0.1:3000/orders');
        const expensesResponse = await axios.get('http://127.0.0.1:3000/expenses');
        const stockResponse = await axios.get('http://127.0.0.1:3000/products');

        const salesData = salesResponse.data;
        const ordersData = ordersResponse.data;
        const expensesData = expensesResponse.data;
        const stockData = stockResponse.data;

        const maxLength = Math.max(salesData.length, ordersData.length, expensesData.length, stockData.length);

        const extendedSalesData = salesData.concat(new Array(maxLength - salesData.length).fill({ date: '', amount: 0 }));
        const extendedOrdersData = ordersData.concat(new Array(maxLength - ordersData.length).fill({ quantity: 0 }));
        const extendedExpensesData = expensesData.concat(new Array(maxLength - expensesData.length).fill({ amount: 0 }));
        const extendedStockData = stockData.concat(new Array(maxLength - stockData.length).fill({ stock_level: 0 }));

        const trends = extendedSalesData.map((sale, index) => ({
          date: sale.date || 'N/A',
          sales: sale.amount || 0,
          orders: extendedOrdersData[index] ? extendedOrdersData[index].quantity : 0,
          profit: sale.amount - (extendedExpensesData[index] ? extendedExpensesData[index].amount : 0),
          stock: extendedStockData[index] ? extendedStockData[index].stock_level : 0
        }));

        setData(trends);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Business Trends</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
            <Line type="monotone" dataKey="profit" stroke="#ff7300" />
            <Line type="monotone" dataKey="stock" stroke="#ff6347" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default BrandingOverview;
