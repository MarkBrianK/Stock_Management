import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddMeetingForm() {
  const [meetingData, setMeetingData] = useState({
    title: "",
    description: "",
    scheduled_date: "",
    reminder_date: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingData((prevData) => {
      let newData = { ...prevData, [name]: value };
      if (name === 'scheduled_date') {
        const scheduledDate = new Date(value);
        scheduledDate.setDate(scheduledDate.getDate() - 1);
        newData.reminder_date = scheduledDate.toISOString().split('T')[0];
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:3000/meetings", { meeting: meetingData });
      navigate("/meetings"); // Redirect to the meetings list page
    } catch (error) {
      console.error('Error adding meeting:', error);
      setError('Error adding meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4">Add Meeting</Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={meetingData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={meetingData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Scheduled Date"
          name="scheduled_date"
          type="date"
          value={meetingData.scheduled_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Reminder Date"
          name="reminder_date"
          type="date"
          value={meetingData.reminder_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled // Disable manual editing of reminder date
        />
        <TextField
          label="Location"
          name="location"
          value={meetingData.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Add Meeting
        </Button>
      </form>
    </div>
  );
}

export default AddMeetingForm;
