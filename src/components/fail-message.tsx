import { useGame } from '@/game-context';
import { Button } from '@mui/material';

const FailMessage = () => {
  const { currentLevel } = useGame();

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
      <p style={{ fontSize: '1.2rem', marginBottom: '5px' }}>
        Try again you have reached the maximum number of hits availabe for level {currentLevel}
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
        onClick={() => window.location.reload()}
      >
        Retry
      </Button>
    </div>
  );
};

export default FailMessage;
