import { Box, Typography } from '@mui/material';
import React from 'react';
import { useSocket } from './socket-provider';

const Leaderboard: React.FC = () => {
  const { players } = useSocket();

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        bgcolor: 'rgba(0, 0, 0, 0.75)', // Darker background for better contrast
        color: '#fff', // White text for contrast
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        zIndex: 10,
        width: '250px',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{ fontWeight: 'bold', color: '#ffdd57' }}
      >
        Leaderboard
      </Typography>
      {Object.entries(players).map(([name, playerData]) => (
        <Box
          key={name}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '4px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {name}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {playerData.hits + 1} hits
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Leaderboard;
