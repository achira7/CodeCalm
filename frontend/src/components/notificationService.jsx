{/*// notificationService.js

export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
      }
    }
  };
  
  export const showNotification = (title, options) => {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  };

  export const checkReminders = () => {
    const reminders = getReminders();
    const now = new Date();
  
    reminders.forEach((reminder, index) => {
      const reminderDate = new Date(reminder.date);
  
      if (reminderDate <= now) {
        // Trigger a notification
        if (Notification.permission === "granted") {
          const notification = new Notification("Breathing Exercise Reminder", {
            body: reminder.message,
            icon: "path/to/icon.png",
            tag: "breathing-exercise"
          });
  
          notification.onclick = () => {
            window.open("http://localhost:5173/employee/breathingexercise"); // Adjust the URL to your breathing exercise page
          };
        }
  
        removeReminder(index);
      }
    });
  };*/}

  

{/*// notificationService.js
import { getReminders, removeReminder } from './reminderService';

export const checkReminders = () => {
  const reminders = getReminders();
  const now = new Date();

  reminders.forEach((reminder, index) => {
    const reminderDate = new Date(reminder.date);

    if (reminderDate <= now) {
      // Trigger a notification
      if (Notification.permission === "granted") {
        const notification = new Notification("Breathing Exercise Reminder", {
          body: reminder.message,
          icon: "path/to/icon.png",
          tag: "breathing-exercise"
        });

        notification.onclick = () => {
          window.open("http://localhost:5173/employee/breathingexercise"); // Adjust the URL to your breathing exercise page
        };
      }

      removeReminder(index);
    }
  });
};

// Request notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Check reminders periodically
setInterval(checkReminders, 60000); // Check every minute
*/}