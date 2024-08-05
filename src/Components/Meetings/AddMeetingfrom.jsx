import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography } from "@mui/material";

function AddMeetingForm() {
  const [meetingData, setMeetingData] = useState({
    title: "",
    description: "",
    date: ""
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:3000/meetings', meetingData);
      setMeetingData({ title: "", description: "", date: "" });
    } catch (error) {
      console.error('Error adding meeting:', error);
      setError('Error adding meeting');
    }
  };

  return (
    <div>
      <Typography variant="h4">Add New Meeting</Typography>
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
          label="Date"
          name="date"
          type="date"
          value={meetingData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Add Meeting
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </form>
    </div>
  );
}

export default AddMeetingForm;
