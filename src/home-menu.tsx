// src/components/GameMenu.tsx
import '@/styles.css';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import startSound from '../src/assets/start.mp3';

const GameMenu: React.FC = () => {
  const navigate = useNavigate();
  const startAudio = new Audio(startSound);

  const handleStartGame = () => {
    startAudio
      .play()
      .then(() => {
        navigate('/play');
      })
      .catch((error) => {
        console.error('Failed to play start sound:', error);
        navigate('/play');
      });
  };

  const handleSettings = () => {
    console.log('Settings Opened');
  };

  const handleExit = () => {
    console.log('Exit Game');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      color="white"
      sx={{ backgroundImage: 'url("/menu-bg.jpeg")', backgroundSize: 'cover' }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        borderRadius={'20px'}
        border={'2px solid #ffffff94'}
        sx={{
          background: 'linear-gradient(45deg, #f2f2f2ba, transparent)',
          backdropFilter: 'blur(6px)',
        }}
        p={'4rem'}
      >
        <Typography variant="h2" gutterBottom>
          Golf-World
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartGame}
          sx={{ marginBottom: 2, width: 200 }}
        >
          Start Game
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSettings}
          sx={{ marginBottom: 2, width: 200 }}
        >
          Settings
        </Button>
        <Button variant="contained" color="error" onClick={handleExit} sx={{ width: 200 }}>
          Exit
        </Button>
      </Box>
    </Box>
  );
};

export default GameMenu;
