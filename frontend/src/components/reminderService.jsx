// reminderService.js

import axios from 'axios';

export const addReminder = async (reminderDate, message, reminderType) => {
  try {
    const response = await axios.post("http://localhost:8000/api/reminders/", {
      date: reminderDate,
      message: message,
      type: reminderType,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding reminder:", error);
    throw error;
  }
};

export const getReminders = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/reminders/");
    return response.data;
  } catch (error) {
    console.error("Error fetching reminders:", error);
    throw error;
  }
};

export const checkReminders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/reminders/");
      return response.data;
    } catch (error) {
      console.error("Error fetching reminders:", error);
      throw error;
    }
  };

export const deleteOldReminders = async () => {
  try {
    const response = await axios.delete("http://localhost:8000/api/reminders/old");
    return response.data;
  } catch (error) {
    console.error("Error deleting old reminders:", error);
    throw error;
  }
};

export const getRemindersForMonth = async (year, month) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/reminders/${year}/${month}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reminders for month:", error);
    throw error;
  }
};
