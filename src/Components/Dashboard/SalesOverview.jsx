import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";
import Chart from "react-apexcharts";
import { format, parseISO, startOfDay, addDays } from "date-fns";

function SalesOverview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesResponse = await axios.get("http://127.0.0.1:3000/sales");
        const salesData = salesResponse.data;

        const allDays = new Set(
          salesData.map((sale) => startOfDay(parseISO(sale.sale_date)).toISOString())
        );

        const sortedDays = Array.from(allDays).sort((a, b) => new Date(a) - new Date(b));

        const completeTrends = sortedDays.map((day, index, array) => {
          const formattedDate = format(parseISO(day), "yyyy-MM-dd");
          const dailySales = salesData
            .filter((sale) => startOfDay(parseISO(sale.sale_date)).toISOString() === day)
            .reduce((acc, sale) => {
              acc.totalRevenue += parseFloat(sale.total_price) || 0;
              acc.totalQuantity += sale.quantity || 0;
              return acc;
            }, { totalRevenue: 0, totalQuantity: 0 });

          return {
            date: formattedDate,
            revenue: dailySales.totalRevenue,
            quantity: dailySales.totalQuantity,
          };
        });

        // Fill in missing days with zero sales
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
                revenue: 0,
                quantity: 0,
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

  const revenueSeries = [
    {
      name: "Revenue (Ksh)",
      data: data.map((item) => ({ x: new Date(item.date).getTime(), y: item.revenue })),
    },
  ];

  const quantitySeries = [
    {
      name: "Quantity Sold (Units)",
      data: data.map((item) => ({ x: new Date(item.date).getTime(), y: item.quantity })),
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
        format: "yyyy-MM-dd",
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => Math.round(value),
      },
    },
    colors: ["#1f77b4", "#ff7f0e"], // Blue and Orange
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sales Daily Trends
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Revenue (Ksh)
        </Typography>
        <Chart options={options} series={revenueSeries} type="line" height={350} />
        <Typography variant="subtitle1" gutterBottom>
          Quantity Sold (Units)
        </Typography>
        <Chart options={options} series={quantitySeries} type="line" height={350} />
      </CardContent>
    </Card>
  );
}

export default SalesOverview;
