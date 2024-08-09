import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";
import Chart from "react-apexcharts";
import { format, parseISO, isValid, startOfDay } from "date-fns";

const keyToLabel = {
  sales: "Sales (Ksh)",
  orders: "Orders (Count)",
  profit: "Profit (Ksh)",
  stock: "Stock Level (Units)",
};

const colors = {
  sales: "#1f77b4",  // Blue
  orders: "#ff7f0e", // Orange
  profit: "#2ca02c", // Green
  stock: "#d62728",  // Red
};

function BrandingOverview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesResponse, ordersResponse, expensesResponse, productsResponse] = await axios.all([
          axios.get("http://127.0.0.1:3000/sales"),
          axios.get("http://127.0.0.1:3000/orders"),
          axios.get("http://127.0.0.1:3000/expenses"),
          axios.get("http://127.0.0.1:3000/products"),
        ]);

        const salesData = salesResponse.data;
        const ordersData = ordersResponse.data;
        const expensesData = expensesResponse.data;
        const productsData = productsResponse.data;

        // Aggregate orders by day
        const ordersByDay = ordersData.reduce((acc, order) => {
          const rawDate = order.order_date || "";
          const parsedDate = parseISO(rawDate);
          if (!isValid(parsedDate)) return acc;
          const dayStart = startOfDay(parsedDate).toISOString();

          if (!acc[dayStart]) acc[dayStart] = 0;
          acc[dayStart] += 1;
          return acc;
        }, {});

        // Aggregate stock levels by day
        const stockByDay = productsData.reduce((acc, product) => {
          const rawDate = product.created_at || "";
          const parsedDate = parseISO(rawDate);
          if (!isValid(parsedDate)) return acc;
          const dayStart = startOfDay(parsedDate).toISOString();

          if (!acc[dayStart]) acc[dayStart] = 0;
          acc[dayStart] += parseFloat(product.stock_level) || 0;
          return acc;
        }, {});

        // Compute cumulative stock levels
        const stockLevels = {};
        Object.keys(stockByDay)
          .sort()
          .forEach((date, index, sortedDates) => {
            const cumulativeStock = sortedDates
              .slice(0, index + 1)
              .reduce((acc, date) => acc + (stockByDay[date] || 0), 0);
            stockLevels[date] = cumulativeStock;
          });

        // Create trends with aggregated data
        const allDays = new Set([
          ...salesData.map((sale) => startOfDay(parseISO(sale.sale_date)).toISOString()),
          ...Object.keys(ordersByDay),
          ...Object.keys(stockLevels),
        ]);

        const completeTrends = Array.from(allDays).map((day) => {
          const formattedDate = format(parseISO(day), "yyyy-MM-dd");
          const dailySales = salesData
            .filter((sale) => startOfDay(parseISO(sale.sale_date)).toISOString() === day)
            .reduce((acc, sale) => acc + parseFloat(sale.total_price), 0);
          const dailyExpenses = expensesData
            .filter((expense) => startOfDay(parseISO(expense.expense_date)).toISOString() === day)
            .reduce((acc, expense) => acc + parseFloat(expense.amount), 0);

          return {
            date: formattedDate,
            sales: dailySales,
            orders: ordersByDay[day] || 0,
            profit: dailySales - dailyExpenses,
            stock: stockLevels[day] || 0,
          };
        });

        setData(completeTrends);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Unable to load data at the moment. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const series = [
    {
      name: keyToLabel.sales,
      data: data.map((item) => ({ x: new Date(item.date).getTime(), y: item.sales })),
    },
    {
      name: keyToLabel.orders,
      data: data.map((item) => ({ x: new Date(item.date).getTime(), y: item.orders })),
    },
    {
      name: keyToLabel.profit,
      data: data.map((item) => ({ x: new Date(item.date).getTime(), y: item.profit })),
    },
    {
      name: keyToLabel.stock,
      data: data.map((item) => ({ x: new Date(item.date).getTime(), y: item.stock })),
    },
  ];

  const options = {
    chart: {
      type: "line",
      height: 350,
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: 'yyyy-MM-dd',
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => Math.round(value),
      },
    },
    colors: [colors.sales, colors.orders, colors.profit, colors.stock],
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Business Daily Trends</Typography>
        <Chart options={options} series={series} type="line" height={350} />
      </CardContent>
    </Card>
  );
}

export default BrandingOverview;
