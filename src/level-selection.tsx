import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Box, Button, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialLevels = [
  {
    id: 1,
    name: 'Level One',
    unlocked: true,
    Points: 3,
    image: 'https://via.placeholder.com/220x150',
  },
  {
    id: 2,
    name: 'Level Two',
    unlocked: false,
    Points: 4,
    image: 'https://via.placeholder.com/220x150',
  },
  {
    id: 3,
    name: 'Level Three',
    unlocked: false,
    Points: 5,
    image: 'https://via.placeholder.com/220x150',
  },
  {
    id: 4,
    name: 'Level Four',
    unlocked: false,
    Points: 4,
    image: 'https://via.placeholder.com/220x150',
  },
  {
    id: 5,
    name: 'Level Five',
    unlocked: false,
    Points: 5,
    image: 'https://via.placeholder.com/220x150',
  },
];

const LevelSelection: React.FC = () => {
  const navigate = useNavigate();
  const [levels] = useState(initialLevels);

  const handleLevelClick = (levelId: number, unlocked: boolean) => {
    if (unlocked) {
      navigate(`/play/level/${levelId}`);
    } else {
      alert('This level is locked!');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        backgroundImage: 'url("/menu-bg.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2rem',
        color: 'white',
      }}
    >
      <Box position="absolute" top={16} left={16}>
        <IconButton onClick={() => navigate(-1)} color="inherit">
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        borderRadius={'20px'}
        border={'2px solid #ffffff94'}
        sx={{
          background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.6), transparent)',
          backdropFilter: 'blur(6px)',
          padding: '4rem',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            color: '#ffeb3b',
            fontWeight: 'bold',
            fontSize: '3rem',
            marginBottom: '2rem',
          }}
        >
          Choose Your Level
        </Typography>
        <Box
          display="flex"
          gap={3}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          sx={{ overflowX: 'auto', padding: '1rem 0' }}
        >
          {levels.map((level) => (
            <Box
              key={level.id}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              width={220}
              height={350}
              p={2}
              borderRadius="20px"
              border={'2px solid #ffffff94'}
              sx={{
                backgroundColor: level.unlocked ? '#1a237e' : '#424242',
                color: '#ffffff',
                opacity: level.unlocked ? 1 : 0.6,
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: level.unlocked ? 'pointer' : 'not-allowed',
                ':hover': level.unlocked
                  ? { transform: 'scale(1.05)', boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)' }
                  : {},
              }}
              onClick={() => handleLevelClick(level.id, level.unlocked)}
            >
              <Box
                position="relative"
                width={220}
                height={150}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ marginBottom: 2 }}
              >
                <Box
                  component="img"
                  src={level.image}
                  alt={level.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    filter: level.unlocked ? 'none' : 'grayscale(100%)',
                  }}
                />
                <Box
                  position="absolute"
                  top={8}
                  right={8}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%',
                    padding: '0.5rem',
                  }}
                >
                  {level.unlocked ? (
                    <LockOpenIcon sx={{ fontSize: 30, color: '#ffeb3b' }} />
                  ) : (
                    <LockIcon sx={{ fontSize: 30, color: '#bdbdbd' }} />
                  )}
                </Box>
              </Box>

              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: '#ffeb3b',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                }}
              >
                {level.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: level.unlocked ? '#ffeb3b' : '#bdbdbd',
                  fontSize: '1.1rem',
                }}
              >
                Points: {level.Points}
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleLevelClick(level.id, level.unlocked)}
                disabled={!level.unlocked}
                sx={{
                  width: '100%',
                  marginTop: '1rem',
                  backgroundColor: level.unlocked ? '#ff5722' : '#777777',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  ':hover': {
                    backgroundColor: level.unlocked ? '#e64a19' : '#777777',
                  },
                }}
              >
                {level.unlocked ? 'Play' : 'Locked'}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LevelSelection;
