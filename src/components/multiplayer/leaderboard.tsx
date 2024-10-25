import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import useMultiplayerGameState from './use-multiplayer-state';

const Leaderboard = () => {
  const { players, hits, localHits: myHits } = useMultiplayerGameState();
  const storedName = localStorage.getItem('playerName');
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '300px',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '16px',
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        Leaderboard
      </Typography>
      <TableContainer component={Paper} style={{ maxHeight: '400px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>
                Player Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>
                Hits
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">{storedName} (You)</TableCell>
              <TableCell align="center">{myHits}</TableCell>
            </TableRow>

            {players.map((player) => {
              if (player === storedName) return null;
              return (
                <TableRow key={player}>
                  <TableCell align="center">{player}</TableCell>
                  <TableCell align="center">{hits[player] || 0}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Leaderboard;
