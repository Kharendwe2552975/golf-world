import menuBg from '@/assets/menu-bg.jpeg';
import pauseButtonIcon from '@/assets/pause-button.png';
import { AppBar, Box, Button, Modal, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBall } from './components/ball/ball-provider';
import Game from './game';
import { useGame } from './game-context';

export default function GameLayout() {
  const [isPaused, setIsPaused] = useState(false);
  const { currentLevel, par } = useGame();
  const { hits } = useBall();
  const navigate = useNavigate();

  const handlePause = () => setIsPaused(true);
  const handleClose = () => setIsPaused(false);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'url(/game-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
      }}
    >
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ height: 60, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Pixel, sans-serif' }}>
              Hits: {hits}
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: 'Pixel, sans-serif' }}>
              Max Hits: {par}
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: 'Pixel, sans-serif' }}>
              Level {currentLevel}
            </Typography>
          </Box>
          <Button
            onClick={handlePause}
            sx={{ display: 'flex', alignItems: 'center', color: 'yellow' }}
          >
            <img
              src={pauseButtonIcon}
              alt="Pause Icon"
              style={{ width: 25, height: 25, marginRight: 8 }}
            />
            <Typography variant="button">Pause</Typography>
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0px 0px 15px 5px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Game />
      </Box>

      <Modal open={isPaused} onClose={handleClose}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          sx={{
            // backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backgroundImage: `url(${menuBg})`,
            color: 'white',
            textAlign: 'center',
            gap: 2,
          }}
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
            <Typography variant="h3" sx={{ color: 'yellow', fontFamily: 'Pixel, sans-serif' }}>
              Game Paused
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 4, width: 200 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleClose}
                sx={{
                  backgroundColor: '#2d2d2d',
                  color: 'yellow',
                  fontFamily: 'Pixel, sans-serif',
                  '&:hover': {
                    backgroundColor: '#444',
                    boxShadow: '0px 0px 10px yellow',
                  },
                }}
              >
                Resume
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{
                  backgroundColor: '#2d2d2d',
                  color: 'lightgreen',
                  fontFamily: 'Pixel, sans-serif',
                  '&:hover': {
                    backgroundColor: '#444',
                    boxShadow: '0px 0px 10px lightgreen',
                  },
                }}
              >
                Restart
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/settings')}
                sx={{
                  backgroundColor: '#2d2d2d',
                  color: 'orange',

                  fontFamily: 'Pixel, sans-serif',
                  '&:hover': {
                    backgroundColor: '#444',
                    boxShadow: '0px 0px 10px',
                  },
                }}
              >
                Settings
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => navigate('/levels')}
                sx={{
                  backgroundColor: '#2d2d2d',
                  color: 'red',
                  fontFamily: 'Pixel, sans-serif',
                  '&:hover': {
                    backgroundColor: '#444',
                    boxShadow: '0px 0px 10px red',
                  },
                }}
              >
                Quit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
