import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Lobby from './lobby';

interface MultiplayerModalProps {
  open: boolean;
  onClose: () => void;
}

const MultiplayerModal: React.FC<MultiplayerModalProps> = ({ open, onClose }) => {
  const [playerName, setPlayerName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [isCreating, setIsCreating] = useState(true); // Track whether creating or joining a game
  const [isInLobby, setIsInLobby] = useState(false); // Track whether in a lobby
  const [creatorName, setCreatorName] = useState(''); // Track the creator's name

  // Retrieve player name from local storage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  const handleCreateGame = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/create-session.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ playerName }),
    });

    const data = await response.json();
    setSessionCode(data.sessionCode); // Assuming your API returns this
    setIsInLobby(true);
    setCreatorName(playerName);

    // Store player name in local storage
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('sessionCode', data.sessionCode);
  };

  const handleJoinGame = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/join-session.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ playerName, sessionCode }),
    });

    const data = await response.json();
    if (data.status === 'success') {
      setIsInLobby(true);

      // Store player name in local storage
      localStorage.setItem('playerName', playerName);
      localStorage.setItem('sessionCode', sessionCode);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {isInLobby ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Lobby
            sessionCode={sessionCode}
            creatorName={creatorName}
            currentPlayerName={playerName}
          />
        </Box>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {isCreating ? 'Create a Game' : 'Join a Game'}
          </Typography>
          <TextField
            label="Player Name"
            variant="outlined"
            fullWidth
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          {isCreating ? (
            <Button variant="contained" color="primary" onClick={handleCreateGame}>
              Create Game
            </Button>
          ) : (
            <>
              <TextField
                label="Session Code"
                variant="outlined"
                fullWidth
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleJoinGame}>
                Join Game
              </Button>
            </>
          )}
          <Button
            onClick={() => setIsCreating(!isCreating)}
            variant="outlined"
            sx={{ marginLeft: 2 }}
          >
            {isCreating ? 'Switch to Join Game' : 'Switch to Create Game'}
          </Button>
        </Box>
      )}
    </Modal>
  );
};

export default MultiplayerModal;
