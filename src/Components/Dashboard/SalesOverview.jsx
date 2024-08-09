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

  // Aggregate sales data by current date
  const currentDate = new Date().toLocaleDateString();
  const aggregatedData = salesData.reduce(
    (acc, sale) => {
      const saleDate = new Date(sale.sale_date).toLocaleDateString();
      if (saleDate === currentDate) {
        acc.totalRevenue += parseFloat(sale.total_price) || 0;
        acc.totalQuantity += sale.quantity || 0;
      }
      return acc;
    },
    { totalRevenue: 0, totalQuantity: 0 }
  );

  // Prepare data for charts
  const revenueSeries = [
    {
      name: 'Revenue',
      data: [{ x: currentDate, y: aggregatedData.totalRevenue }],
    },
  ];

  const quantitySeries = [
    {
      name: 'Quantity Sold',
      data: [{ x: currentDate, y: aggregatedData.totalQuantity }],
    },
  ];

  const chartOptions = {
    chart: {
      type: 'line',
    },
    xaxis: {
      type: 'category',
      title: {
        text: 'Date',
      },
    },
    yaxis: {
      title: {
        text: 'Amount',
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Sales Overview</Typography>
        <ApexCharts
          options={{ ...chartOptions, title: { text: 'Total Revenue for Today' } }}
          series={revenueSeries}
          type="line"
          height={300}
        />
        <ApexCharts
          options={{ ...chartOptions, title: { text: 'Total Quantity Sold for Today' } }}
          series={quantitySeries}
          type="line"
          height={300}
        />
      </CardContent>
    </Card>
  );
}

export default SalesOverview;
