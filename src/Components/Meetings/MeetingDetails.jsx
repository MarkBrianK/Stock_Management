import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, Card, CardContent, CircularProgress } from "@mui/material";

function MeetingDetails() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/meetings/${id}`);
        setMeeting(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meeting details:', error);
        setError('Error fetching meeting details');
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">{meeting.title}</Typography>
        <Typography variant="h6">Date: {new Date(meeting.date).toLocaleDateString()}</Typography>
        <Typography variant="body1">{meeting.description}</Typography>
      </CardContent>
    </Card>
  );
}

export default MeetingDetails;
