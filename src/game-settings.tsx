import menuBg from '@/assets/menu-bg.jpeg';
import { Box, Button, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextureSelectionModal from './components/texture-selection-modal';
import { useGame } from './game-context';

const GameSettings: React.FC = () => {
  const navigate = useNavigate();
  const [openTexture, setOpenTexture] = useState(false);
  const { isMusicOn, isSoundOn, toggleMusic, toggleSound } = useGame();
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        color="white"
        sx={{ backgroundImage: `url(${menuBg})`, backgroundSize: 'cover' }}
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
          <Typography variant="h4" gutterBottom>
            Game Settings
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={isMusicOn} onChange={() => toggleMusic()} />}
              label="Music"
            />
            <FormControlLabel
              control={<Switch checked={isSoundOn} onChange={() => toggleSound()} />}
              label="Sound"
            />
          </FormGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenTexture(true)}
            sx={{ marginTop: 2, width: 200 }}
          >
            Select Ball Texture
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(-1)}
            sx={{ marginTop: 2, width: 200 }}
          >
            Back to Menu
          </Button>
        </Box>
      </Box>
      <TextureSelectionModal open={openTexture} onClose={() => setOpenTexture(false)} />
    </>
  );
};

export default GameSettings;
