import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../index.css';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import SlidingMenu from '../components/SlidingMenu';

const GamePage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Fetch the first message from the server when the page loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/message')
      .then(response => {
        setMessages([{ text: response.data.message, sender: 'LLM' }]);
      })
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  // Handle sending messages
  const sendMessage = async () => {
    if (!input) return;

    // Add user message to the chat
    const newMessages = [...messages, { text: input, sender: 'User' }];
    setMessages(newMessages);
    setInput(''); // Clear the input field

    try {
      // Fetch response from the server
      const response = await axios.get('http://localhost:5000/api/message');
      setMessages(prevMessages => [
        ...prevMessages,
        { text: response.data.message, sender: 'LLM' }
      ]);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#222831] text-[#EEEEEE]">
      <Logo />
      <SlidingMenu />

      {/* Chatbox container */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`mb-4 p-3 max-w-xs ${msg.sender === 'User' ? 'bg-[#76ABAE] self-end' : 'bg-[#31363F] self-start'} rounded-lg shadow-md`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex items-center p-4 bg-[#31363F]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-grow bg-[#3D434A] text-white rounded-lg p-3 mr-3 outline-none"
        />
        <motion.button
          onClick={sendMessage}
          className="bg-[#76ABAE] hover:bg-[#76ABAE]/80 px-6 py-3 rounded-lg font-semibold"
          whileHover={{ scale: 1.1 }}
        >
          Send
        </motion.button>
      </div>

      <Footer />
    </div>
  );
};

export default GamePage;