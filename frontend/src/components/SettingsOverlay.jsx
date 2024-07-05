// SettingsOverlay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SettingsOverlay = ({ userData, onClose }) => {
  const [darkMode, setDarkMode] = useState(userData.dark_mode || false);
  const [notifications, setNotifications] = useState(userData.notifications || false);

  useEffect(() => {
    // Apply the dark mode if enabled
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSaveSettings = async () => {
    try {
      await axios.post('http://localhost:8000/api/save-settings/', {
        dark_mode: darkMode,
        notifications: notifications,
      }, {
        withCredentials: true,
      });
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-black dark:text-white">
        <h2 className="text-xl mb-4">Settings</h2>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span>Dark Mode</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            <span>Enable Notifications</span>
          </label>
        </div>
        <button onClick={handleSaveSettings} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
        <button onClick={onClose} className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded-md">Cancel</button>
      </div>
    </div>
  );
};

export default SettingsOverlay;
