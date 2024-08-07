import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, List, ListItem, ListItemText, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Delete, Info } from "@mui/icons-material";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MeetingList() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetingsForDate, setMeetingsForDate] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: selectedDate.toISOString().split('T')[0] // Set initial date to selected date
  });
  const [addMeetingError, setAddMeetingError] = useState(null);

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

  useEffect(() => {
    const filteredMeetings = meetings.filter(
      (meeting) => new Date(meeting.date).toDateString() === selectedDate.toDateString()
    );
    setMeetingsForDate(filteredMeetings);
    setNewMeeting((prevData) => ({
      ...prevData,
      date: selectedDate.toISOString().split('T')[0] // Update new meeting date to selected date
    }));
  }, [selectedDate, meetings]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:3000/meetings', newMeeting);
      setNewMeeting({ title: "", description: "", date: selectedDate.toISOString().split('T')[0] });
      // Fetch updated meetings list
      const response = await axios.get('http://127.0.0.1:3000/meetings');
      setMeetings(response.data);
    } catch (error) {
      console.error('Error adding meeting:', error);
      setAddMeetingError('Error adding meeting');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
      />
      <Box marginTop={2}>
        {meetingsForDate.length === 0 ? (
          <Typography>No meetings scheduled for this date.</Typography>
        ) : (
          <List>
            {meetingsForDate.map((meeting) => (
              <ListItem key={meeting.id}>
                <ListItemText
                  primary={meeting.title}
                  secondary={`Date: ${new Date(meeting.date).toLocaleDateString()}`}
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
        <Box component="form" onSubmit={handleSubmit} marginTop={2}>
          <Typography variant="h6">Add New Meeting</Typography>
          <TextField
            label="Title"
            name="title"
            value={newMeeting.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={newMeeting.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={newMeeting.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Add Meeting
          </Button>
          {addMeetingError && <Typography color="error">{addMeetingError}</Typography>}
        </Box>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Meeting Details</DialogTitle>
        <DialogContent>
          {selectedMeeting && (
            <>
              <Typography variant="h6">{selectedMeeting.title}</Typography>
              <Typography variant="body1">{selectedMeeting.description}</Typography>
              <Typography variant="body2">Date: {new Date(selectedMeeting.date).toLocaleDateString()}</Typography>
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
