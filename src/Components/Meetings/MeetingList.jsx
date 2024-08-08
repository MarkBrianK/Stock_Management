import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { Delete, Info } from "@mui/icons-material";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/MeetingList.module.css"; // Import CSS Module

function MeetingList() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/meetings/${id}`);
      setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== id));
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setError('Error deleting meeting');
    }
  };

  const handleDetails = (meeting) => {
    setSelectedMeeting(meeting);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMeeting(null);
  };

  // Create a set of dates that have meetings
  const meetingDates = new Set(
    meetings.map(meeting => new Date(meeting.scheduled_date).toDateString())
  );

  // Add custom class to dates with meetings
  const tileClassName = ({ date }) => {
    return meetingDates.has(date.toDateString()) ? styles.highlight : null;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Calendar
        tileClassName={tileClassName}
      />
      <Box marginTop={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/add-meeting')}
          style={{ marginBottom: '20px' }}
        >
          Add Meeting
        </Button>
        {meetings.length === 0 ? (
          <Typography>No meetings available.</Typography>
        ) : (
          <List>
            {meetings.map((meeting) => (
              <ListItem key={meeting.id}>
                <ListItemText
                  primary={meeting.title}
                  secondary={`Date: ${new Date(meeting.scheduled_date).toLocaleDateString()}`}
                />
                <IconButton onClick={() => handleDetails(meeting)} color="primary">
                  <Info />
                </IconButton>
                <IconButton onClick={() => handleDelete(meeting.id)} color="secondary">
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Meeting Details</DialogTitle>
        <DialogContent>
          {selectedMeeting && (
            <>
              <Typography variant="h6">{selectedMeeting.title}</Typography>
              <Typography variant="body1">{selectedMeeting.description}</Typography>
              <Typography variant="body2">Scheduled Date: {new Date(selectedMeeting.scheduled_date).toLocaleDateString()}</Typography>
              <Typography variant="body2">Reminder Date: {new Date(selectedMeeting.reminder_date).toLocaleDateString()}</Typography>
              <Typography variant="body2">Location: {selectedMeeting.location}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MeetingList;
