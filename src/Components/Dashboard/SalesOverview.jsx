import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";
import ApexCharts from "react-apexcharts";

function SalesOverview() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
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

    fetchSalesData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  // Prepare data for charts
  const chartData = {
    revenueSeries: [
      {
        name: 'Revenue',
        data: salesData.map(sale => ({
          x: new Date(sale.sale_date).toLocaleDateString(), // Format date for x-axis
          y: parseFloat(sale.total_price),
        })),
      },
    ],
    quantitySeries: [
      {
        name: 'Quantity Sold',
        data: salesData.map(sale => ({
          x: new Date(sale.sale_date).toLocaleDateString(), // Format date for x-axis
          y: sale.quantity,
        })),
      },
    ],
    options: {
      chart: {
        type: 'line',
      },
      xaxis: {
        type: 'category', // Ensures categories are used for the x-axis
        title: {
          text: 'Date',
        },
      },
      yaxis: {
        title: {
          text: 'Amount',
        },
      },
      title: {
        text: 'Sales Overview',
        align: 'left',
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Sales Overview</Typography>
        <ApexCharts
          options={{ ...chartData.options, title: { text: 'Revenue Over Time' } }}
          series={chartData.revenueSeries}
          type="line"
          height={300}
        />
        <ApexCharts
          options={{ ...chartData.options, title: { text: 'Quantity Sold Over Time' } }}
          series={chartData.quantitySeries}
          type="line"
          height={300}
        />
      </CardContent>
    </Card>
  );
}

export default SalesOverview;
