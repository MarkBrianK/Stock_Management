import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";
import ApexCharts from "react-apexcharts";

function ProfitOverview() {
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const salesResponse = await axios.get("http://127.0.0.1:3000/sales");
        setSalesData(salesResponse.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setError("Error fetching sales data");
        setLoading(false);
      }
    };

    const fetchExpensesData = async () => {
      try {
        const expensesResponse = await axios.get("http://127.0.0.1:3000/expenses");
        setExpensesData(expensesResponse.data);
      } catch (error) {
        console.error("Error fetching expenses data:", error);
        setError("Error fetching expenses data");
        setLoading(false);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchSalesData(), fetchExpensesData()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  // Calculate totals and profit
  const totalSales = salesData.reduce((acc, sale) => acc + (parseFloat(sale.total_price) || 0), 0);
  const totalExpenses = expensesData.reduce((acc, expense) => acc + (parseFloat(expense.amount) || 0), 0);
  const totalProfit = totalSales - totalExpenses;

  // Get current date
  const currentDate = new Date().toLocaleDateString();

  // Prepare data for the chart
  const chartData = {
    series: [
      {
        name: "Profit",
        data: [
          {
            x: currentDate,
            y: totalProfit,
          },
        ],
      },
    ],
    options: {
      chart: {
        type: "line",
      },
      xaxis: {
        type: "category",
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Profit",
        },
      },
      title: {
        text: "Profit Overview",
        align: "left",
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Total Profit</Typography>
        <Typography variant="h4">Ksh {totalProfit.toFixed(2)}</Typography>
        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={300}
        />
      </CardContent>
    </Card>
  );
}

export default ProfitOverview;
