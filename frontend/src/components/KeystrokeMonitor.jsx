// KeystrokeMonitor.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KeystrokeMonitor = () => {
  const [keystrokes, setKeystrokes] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!startTime) {
        setStartTime(Date.now());
      }
      const keystroke = {
        key: event.key,
        timestamp: Date.now(),
      };
      setKeystrokes(prevKeystrokes => [...prevKeystrokes, keystroke]);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [startTime]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (keystrokes.length > 0) {
        sendKeystrokeData();
      }
    }, 10000); // Send data every 10 seconds

    return () => clearInterval(intervalId);
  }, [keystrokes]);

  const sendKeystrokeData = async () => {
    const endTime = Date.now();
    const typingDuration = (endTime - startTime) / 1000; // in seconds
    const typingSpeed = keystrokes.length / typingDuration; // characters per second
    const errorRate = calculateErrorRate(keystrokes); // Implement this function based on your criteria

    try {
      await axios.post('/api/analyze/', {
        typing_speed: typingSpeed,
        error_rate: errorRate,
      });
      setKeystrokes([]);
      setStartTime(null);
    } catch (error) {
      console.error("Error sending keystroke data:", error);
    }
  };

  const calculateErrorRate = (keystrokes) => {
    // Simple error rate calculation example
    const errors = keystrokes.filter(k => k.key === 'Backspace').length;
    return (errors / keystrokes.length) * 100;
  };

  return <div>Keystroke monitoring is active...</div>;
};

export default KeystrokeMonitor;
