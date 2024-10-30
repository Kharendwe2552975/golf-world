// src/components/GameMenu.tsx
import meunBg from '@/assets/menu-bg.jpeg';
import '@/styles.css';
import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import startSound from '../src/assets/start.mp3';

import TextureSelectionModal from './components/TextureSelectionModal';

const GameMenu: React.FC = () => {
  const navigate = useNavigate();
  const startAudio = new Audio(startSound);

  const handleStartGame = () => {
    navigate('/play');
    localStorage.removeItem('sessionCode');
    localStorage.setItem('hits', '0');
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

  const [openMultiplayer, setOpenMultiplayer] = useState(false);
  const handleOpenMultiplayerModal = () => setOpenMultiplayer(true);
  const handleCloseMultiplayerModal = () => setOpenMultiplayer(false);

  const [openTexture, setOpenTexture] = useState(false);
  const handleOpenTextureModal = () => setOpenTexture(true);
  const handleCloseTextureModal = () => setOpenTexture(false);

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        color="white"
        sx={{ backgroundImage: `url(${meunBg})`, backgroundSize: 'cover' }}
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
            SinglePlayer
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleOpenMultiplayerModal}
            sx={{ marginBottom: 2, width: 200 }}
          >
            Multiplayer
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenTextureModal}
            sx={{ marginBottom: 2, width: 200 }}
          >
            Select Ball Texture
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

      {/* Texture Selection Modal */}
      <TextureSelectionModal open={openTexture} onClose={handleCloseTextureModal} />
    </>
  );
};

export default GameMenu;
