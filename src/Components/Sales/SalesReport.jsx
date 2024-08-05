import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, CircularProgress } from "@mui/material";

function SalesReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/sales/report');
        setReportData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales report:', error);
        setError('Error fetching sales report');
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!reportData) return <Typography>No report data available.</Typography>;

  return (
    <div>
      <Typography variant="h4">Sales Report</Typography>
      <Typography variant="h6">Total Sales: ${reportData.totalSales}</Typography>
    
    </div>
  );
}

export default SalesReport;
