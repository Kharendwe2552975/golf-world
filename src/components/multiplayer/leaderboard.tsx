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
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        zIndex: 10,
        width: '250px',
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Leaderboard
      </Typography>
      {Object.entries(players).map(([name, playerData]) => (
        <Typography key={name} variant="body1">
          {name}: {playerData.hits} hits
        </Typography>
      ))}
    </Box>
  );
};

export default Leaderboard;
