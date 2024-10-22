import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LobbyProps {
  sessionCode: string;
  creatorName: string; // Add creator name prop
  currentPlayerName: string; // Add current player's name prop
}

const Lobby: React.FC<LobbyProps> = ({ sessionCode, creatorName, currentPlayerName }) => {
  const [players, setPlayers] = useState<string[]>([]);
  const navigate = useNavigate();
  const onStartGame = async () => {
    navigate('/play'); // Navigate to the play route
  };

  const fetchPlayers = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/get-game-state.php?sessionCode=${sessionCode}`,
    );
    const data = await response.json();
    if (data.status === 'success') {
      setPlayers(data['state'].players);
      if (data['state'].gameState === 'ongoing') {
        navigate('/play');
      }
    }
  };

  useEffect(() => {
    fetchPlayers(); // Fetch players on mount
    const interval = setInterval(fetchPlayers, 5000); // Fetch players every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [sessionCode]);

  return (
    <Box>
      <Typography variant="h6">Lobby - Session Code: {sessionCode}</Typography>
      <Typography variant="body1">Players:</Typography>
      <Box sx={{ marginLeft: 2, marginBottom: 2 }}>
        {players.map((player, index) => (
          <Typography key={index}>{index + 1 + ' : ' + player}</Typography> // Display player number
        ))}
      </Box>

      <Box>
        {currentPlayerName === creatorName && ( // Check if the current player is the creator
          <Button variant="contained" color="primary" onClick={onStartGame}>
            Start Game
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Lobby;
