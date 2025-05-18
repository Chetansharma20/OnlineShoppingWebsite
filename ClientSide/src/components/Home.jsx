import React from 'react';
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f4f8',  // Light background color
        padding: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#00796b' }}>
        Welcome to Our Website
      </Typography>
    </Box>
  );
}

export default Home;
