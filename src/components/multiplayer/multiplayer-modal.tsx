import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from './socket-provider';

interface MultiplayerModalProps {
  open: boolean;
  onClose: () => void;
}

const MultiplayerModal: React.FC<MultiplayerModalProps> = ({ open, onClose }) => {
  const { createSession, joinSession, startGame, gameStarted, players, sessionCode } = useSocket();
  const [playerName, setPlayerName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(true);
  const [isInLobby, setIsInLobby] = useState<boolean>(false);
  const [inputSessionCode, setInputSessionCode] = useState<string>('');
  const [canStartGame, setCanStartGame] = useState<boolean>(false);

  // Retrieve player name from local storage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  const toggleCreating = () => setIsCreating(!isCreating);

  const createGame = async () => {
    try {
      await createSession(playerName);
      setIsInLobby(true);
      setCanStartGame(true);
      localStorage.setItem('playerName', playerName); // Persist player name
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  const joinGame = async (code: string) => {
    try {
      await joinSession(playerName, code);
      setIsInLobby(true);
      localStorage.setItem('playerName', playerName); // Persist player name
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  const navigate = useNavigate();

  // Redirect to the game page when the game starts
  useEffect(() => {
    if (gameStarted) {
      navigate('/play');
    }
  }, [gameStarted]);

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
          <Typography variant="h6">Lobby - Session Code: {sessionCode}</Typography>
          {Object.values(players).map((player) => (
            <Typography key={player.name}>{player.name}</Typography>
          ))}

          {canStartGame && (
            <Button variant="contained" color="primary" onClick={startGame}>
              Start Game
            </Button>
          )}
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
            <Button variant="contained" color="primary" onClick={createGame}>
              Create Game
            </Button>
          ) : (
            <>
              <TextField
                label="Session Code"
                variant="outlined"
                fullWidth
                value={inputSessionCode}
                onChange={(e) => setInputSessionCode(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => joinGame(inputSessionCode)}
              >
                Join Game
              </Button>
            </>
          )}
          <Button onClick={toggleCreating} variant="outlined" sx={{ marginLeft: 2 }}>
            {isCreating ? 'Switch to Join Game' : 'Switch to Create Game'}
          </Button>
        </Box>
      )}
    </Modal>
  );
};

export default MultiplayerModal;
