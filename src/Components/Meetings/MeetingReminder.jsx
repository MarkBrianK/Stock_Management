import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, List, ListItem, CircularProgress, ListItemText, Box } from "@mui/material";

function MeetingReminder() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/meetings');
        const upcomingMeetings = response.data
          .filter(meeting => new Date(meeting.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
        setMeetings(upcomingMeetings);
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Upcoming Meetings
      </Typography>
      {meetings.length === 0 ? (
        <Typography>No upcoming meetings.</Typography>
      ) : (
        <List>
          {meetings.map((meeting) => (
            <ListItem key={meeting.id}>
              <ListItemText
                primary={meeting.title}
                secondary={`Date: ${new Date(meeting.date).toLocaleDateString()} | Time: ${new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default MeetingReminder;
