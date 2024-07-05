import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import ChatBot from './components/ChatBot';
import { Container } from '@mui/material';

const App = () => {
  return (
    <Provider store={store}>
      <Container>
        <ChatBot />
      </Container>
    </Provider>
  );
};

export default App;


