import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LobbyProps {
  sessionCode: string;
  creatorName: string;
  currentPlayerName: string;
}

const Lobby: React.FC<LobbyProps> = ({ sessionCode, creatorName, currentPlayerName }) => {
  const [players, setPlayers] = useState<{
    [key: string]: { hits: number; ballPosition: { x: number; y: number; z: number } };
  }>({});
  const navigate = useNavigate();

  const onStartGame = async () => {
    navigate('/play'); // Navigate to the play route
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/get-game-state.php?sessionCode=${sessionCode}`,
      );
      const data = await response.json();

      if (data.status === 'success') {
        // Set players as the object received from the server
        setPlayers(data['state'].players || {});

        if (data['state'].gameState === 'ongoing') {
          navigate('/play');
        }
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  useEffect(() => {
    fetchPlayers(); // Fetch players on mount
    const interval = setInterval(fetchPlayers, 1000); // Fetch players every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [sessionCode]);

  return (
    <Box>
      <Typography variant="h6">Lobby - Session Code: {sessionCode}</Typography>
      <Typography variant="body1">Players:</Typography>
      <Box sx={{ marginLeft: 2, marginBottom: 2 }}>
        {Object.entries(players).map(([playerName], index) => (
          <Typography key={index}>
            {index + 1} : {playerName}
          </Typography>
        ))}
      </Box>

      <Box>
        {currentPlayerName === creatorName && (
          <Button variant="contained" color="primary" onClick={onStartGame}>
            Start Game
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Lobby;
