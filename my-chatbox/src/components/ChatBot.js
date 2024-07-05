import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../redux/actions';
import { TextField, Button, Box } from '@mui/material';
import Message from './Message';

const ChatBot = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages);

  const handleSend = () => {
    if (input.trim()) {
      dispatch(addMessage(input));
      setInput('');
    }
  };

  return (
    <Box p={3}>
      <Box mb={3}>
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </Box>
      <Box display="flex">
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBot;



