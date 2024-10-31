import { Box, Button, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GameSettings: React.FC = () => {
  const navigate = useNavigate();

  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const handleSaveSettings = () => {
    console.log('Settings Saved:', { isMusicOn, isSoundOn });
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
        <Typography variant="h4" gutterBottom>
          Game Settings
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={isMusicOn} onChange={(e) => setIsMusicOn(e.target.checked)} />
            }
            label="Music"
          />
          <FormControlLabel
            control={
              <Switch checked={isSoundOn} onChange={(e) => setIsSoundOn(e.target.checked)} />
            }
            label="Sound"
          />
        </FormGroup>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/select-ball-version')}
          sx={{ marginTop: 2, width: 200 }}
        >
          Ball Version
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          sx={{ marginTop: 2, width: 200 }}
        >
          Save Settings
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
  );
};

export default GameSettings;
