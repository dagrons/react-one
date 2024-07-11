// src/components/ChatInput.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../store/chatSlice';
import { TextField, PrimaryButton } from '@fluentui/react';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const sendMessage = () => {
    if (input.trim()) {
      dispatch(addMessage({'sender': 'user', 'text': input}));
      dispatch(addMessage({'sender': 'bot', 'text': input})); // Simulate bot response
      setInput('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      sendMessage()
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <TextField
        value={input}
        multiline
        resizable={false}
        onChange={(e, newValue) => setInput(newValue || '')}
        onKeyDown={handleKeyDown}
        styles={{ root: {flex: 1, marginRight: 10, height: "auto"}, field: {height: "32px"}, fieldGroup: {minHeight: ""} }}
      />
      <PrimaryButton onClick={sendMessage}>Send</PrimaryButton>
    </div>
  );
};



