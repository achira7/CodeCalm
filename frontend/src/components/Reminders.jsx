import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import { addReminder } from './reminderService';
//import { requestNotificationPermission, showNotification } from './notificationService';

const Reminders = () => {
  const [reminderDate, setReminderDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [reminderType, setReminderType] = useState("Breathing Exercise");



const addReminder = async (reminderDate, message, reminderType) => {
    try {
      const response = await axios.post("http://localhost:8000/api/reminders/", {
        date: reminderDate,
        message: message,
        type: reminderType,
      });
      alert("Reminder set successfully!");
      return response.data;
    } catch (error) {
      alert("Failed to set reminder.");
      console.error("Error adding reminder:", error);
      throw error;
    }
  };


  useEffect(() => {
    //requestNotificationPermission();
  }, []);


  return (
    <div className="p-4" style={{ zIndex: 1000 }}>
      <h2 className="text-xl font-bold mb-4">Set a Reminder</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Date and Time</label>
        <DatePicker
          selected={reminderDate}
          onChange={date => setReminderDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          timeIntervals={1}
          minTime={new Date().setHours(0, 7)}
          maxTime={new Date().setHours(18, 0)}
          filterDate={(date) => date.getDay() !== 0}
          popperPlacement="top-end"
          popperModifiers={{
            preventOverflow: {
              enabled: true,
              escapeWithReference: false,
              boundariesElement: 'viewport'
            }
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Reminder message"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Reminder Type</label>
        <select
          value={reminderType}
          onChange={(e) => setReminderType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="Breathing Exercise">Breathing Exercise</option>
          <option value="Track Listening">Track Listening</option>
        </select>
      </div>
      <button
        onClick={addReminder}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Set Reminder
      </button>
    </div>
  );
};

export default Reminders;
