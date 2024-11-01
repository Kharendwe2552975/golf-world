import { useGame } from '@/game-context';
import { Button } from '@mui/material';

const EndMessage = () => {
  const { restartGame } = useGame();

  const message = (
    <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#2f855a' }}>
      🎉 Congratulations! 🎉
    </h1>
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(242, 242, 242, 0.8)', // Adjusted for a lighter transparency
        backdropFilter: 'blur(6px)',
        padding: '30px',
        borderRadius: '20px',
        textAlign: 'center',
        color: '#333',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        maxWidth: '400px',
        fontFamily: "'Roboto', sans-serif",
        transition: 'transform 0.3s ease',
      }}
    >
      {message}
      <p style={{ fontSize: '1.2rem', marginBottom: '5px' }}>
        You have completed the game. You wish to start again?
      </p>
      <Button
        variant="contained"
        color="primary"
        style={{
          marginTop: '20px',
          background: '#2f855a',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '10px',
          cursor: 'pointer',
        }}
        onClick={() => {
          restartGame();
          // setInterval(() => {
          //   navigate('/levels');
          // }, 2000);
        }}
      >
        Restart Game
      </Button>
    </div>
  );
};

export default EndMessage;
