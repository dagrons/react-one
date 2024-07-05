import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Message = ({ message }) => {
  return (
    <Box mb={2}>
      <Paper elevation={2} style={{ padding: '10px' }}>
        <Typography variant="body1">{message}</Typography>
      </Paper>
    </Box>
  );
};

export default Message;



