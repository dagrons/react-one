// src/components/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Chat Bot</h1>
      <Link to="/chat">Go to Chat</Link>
    </div>
  );
};

