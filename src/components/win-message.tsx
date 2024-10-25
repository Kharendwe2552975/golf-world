import { Button } from '@mui/material';
import { useBall } from './ball/ball-provider';

// Function to classify score based on hits
const getClassification = (hits: number, par: number) => {
  const diff = hits - par;
  if (diff === -3) return 'Albatross';
  if (diff === -2) return 'Eagle';
  if (diff === -1) return 'Birdie';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  if (diff === 2) return 'Double Bogey';
  if (diff >= 3) return 'Triple Bogey';
  return 'Invalid Score';
};

const WinMessage = () => {
  const { hits } = useBall();
  const par = 3;
  const classification = getClassification(hits, par);

  // Determine message based on classification
  let message;
  if (hits <= par) {
    message = (
      <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#2f855a' }}>
        🎉 Congratulations! 🎉
      </h1>
    );
  } else {
    message = (
      <h1 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#e53e3e' }}>
        😞 Better luck next time! 😞
      </h1>
    );
  }

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
        You completed the hole in <strong style={{ color: '#e53e3e' }}>{hits}</strong> hits.
      </p>
      <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3182ce' }}>
        Your score: <strong>{classification}</strong>
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
        Next Hole
      </Button>
    </div>
  );
};

export default WinMessage;
