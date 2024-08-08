import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";
import ApexCharts from "react-apexcharts";

function StockOverview() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch stock data
  const fetchStockData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/products');
      setStockData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Error fetching stock data');
      setLoading(false);
    }
  };

  // Fetch stock data on component mount
  useEffect(() => {
    fetchStockData();

    // Polling for updates every 30 seconds
    const intervalId = setInterval(fetchStockData, 30000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  // Prepare data for the chart
  const chartData = {
    series: [
      {
        name: 'Stock Level',
        data: stockData.map(product => product.stock_level),
      },
    ],
    options: {
      chart: {
        type: 'bar',
      },
      xaxis: {
        categories: stockData.map(product => product.name), // Assuming 'name' is the product name
        title: {
          text: 'Products',
        },
      },
      yaxis: {
        title: {
          text: 'Stock Level',
        },
      },
      plotOptions: {
        bar: {
          colors: {
            ranges: [
              {
                from: 0,
                to: 20,
                color: '#FF0000',
              },
              {
                from: 21,
                to: Number.MAX_VALUE,
                color: '#00A86B',
              },
            ],
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Stock Levels by Product</Typography>
        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </CardContent>
    </Card>
  );
}

export default StockOverview;
