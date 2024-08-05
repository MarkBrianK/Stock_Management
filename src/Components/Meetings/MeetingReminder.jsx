import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, List, ListItem, CircularProgress } from "@mui/material";

function MeetingReminder() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/meetings');
        const upcomingMeetings = response.data.filter(meeting => new Date(meeting.date) > new Date());
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
    <div>
      <Typography variant="h4">Upcoming Meetings</Typography>
      <List>
        {meetings.map((meeting) => (
          <ListItem key={meeting.id}>
            <Typography variant="body1">{meeting.title} - {new Date(meeting.date).toLocaleDateString()}</Typography>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default MeetingReminder;
