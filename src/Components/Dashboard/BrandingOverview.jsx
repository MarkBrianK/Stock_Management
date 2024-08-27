import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";
import Chart from "react-apexcharts";
import { format, parseISO, isValid, startOfDay, addDays } from "date-fns";

const keyToLabel = {
  orders: "Orders (Count)",
};

const colors = {
  orders: "#ff7f0e", // Orange
};

function OrdersOverview() { // Renamed the component to be more descriptive
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse] = await axios.all([
          axios.get("http://127.0.0.1:3000/orders"),
        ]);

        const ordersData = ordersResponse.data;

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

        // Create trends with aggregated data
        const allDays = new Set(Object.keys(ordersByDay));
        const sortedDays = Array.from(allDays).sort((a, b) => new Date(a) - new Date(b));

        const completeTrends = sortedDays.map((day) => {
          const formattedDate = format(parseISO(day), "yyyy-MM-dd");
          return {
            date: formattedDate,
            orders: ordersByDay[day] || 0,
          };
        });

        // Fill in missing days with zeros
        const filledTrends = [];
        for (let i = 0; i < completeTrends.length; i++) {
          filledTrends.push(completeTrends[i]);

          if (i < completeTrends.length - 1) {
            const nextDay = startOfDay(addDays(parseISO(completeTrends[i].date), 1));
            const diff = Math.floor(
              (startOfDay(parseISO(completeTrends[i + 1].date)) - nextDay) / (1000 * 60 * 60 * 24)
            );
            for (let j = 0; j < diff; j++) {
              filledTrends.push({
                date: format(addDays(nextDay, j), "yyyy-MM-dd"),
                orders: 0,
              });
            }
          }
        }

        setData(filledTrends);
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
      name: keyToLabel.orders,
      data: data.map((item) => ({ x: new Date(item.date).getTime(), y: item.orders })),
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
    colors: [colors.orders],
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Orders Daily Trends</Typography>
        <Chart options={options} series={series} type="line" height={350} />
      </CardContent>
    </Card>
  );
}

export default OrdersOverview;
