import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Typography, CircularProgress } from "@mui/material";

function MeetingList() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/meetings');
        setMeetings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meetings:', error);
        setError('Error fetching meetings');
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <List>
      {meetings.map((meeting) => (
        <ListItem key={meeting.id}>
          <ListItemText
            primary={meeting.title}
            secondary={`Date: ${new Date(meeting.date).toLocaleDateString()}`}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default MeetingList;
