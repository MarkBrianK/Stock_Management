import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format, parseISO, isValid } from 'date-fns';

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

        const trends = salesData.map((sale) => {
          const rawDate = sale.sale_date || '';
          const parsedDate = parseISO(rawDate);
          const formattedDate = isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : rawDate;

          const order = ordersData.find(order => order.sale_date === sale.sale_date) || {};
          const expense = expensesData.find(expense => expense.sale_date === sale.sale_date) || {};
          const stock = stockData.find(product => product.sale_date === sale.sale_date) || {};

          return {
            date: formattedDate,
            sales: parseFloat(sale.total_price) || 0,
            orders: parseFloat(order.quantity) || 0,
            profit: parseFloat(sale.total_price) - parseFloat(expense.amount) || 0,
            stock: parseFloat(stock.stock_level) || 0
          };
        });

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
