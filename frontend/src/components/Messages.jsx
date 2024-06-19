// Messages.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messages = ({ userData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState('');
  const [receivers, setReceivers] = useState([]);

  useEffect(() => {
    fetchMessages();
    fetchReceivers();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/messages/', { withCredentials: true });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchReceivers = async (searchQuery = '') => {
    try {
      const response = await axios.get('http://localhost:8000/api/employeelist/', {
        params: { search: searchQuery },
        withCredentials: true,
      });
  
      const users = response.data.filter(user => {
        if (userData.is_superuser) return user.is_staff;
        if (userData.is_staff) return user.team === userData.team || user.is_superuser;
        return user.is_staff && user.team === userData.team;
      });
  
      setReceivers(users);
    } catch (error) {
      console.error('Error fetching receivers:', error);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:8000/api/messages/', {
        receiver: receiver,
        content: newMessage,
      }, { withCredentials: true });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/messages/${id}/`, { withCredentials: true });
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      <div>
        <select value={receiver} onChange={e => setReceiver(e.target.value)}>
          <option value="">Select Receiver</option>
          {receivers.map(user => (
            <option key={user.id} value={user.id}>
              {user.first_name} {user.last_name} ({user.email})
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <p><strong>{message.sender.first_name} {message.sender.last_name}:</strong> {message.content}</p>
            {message.sender.id === userData.id || message.receiver.id === userData.id ? (
              <button onClick={() => deleteMessage(message.id)}>Delete</button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
