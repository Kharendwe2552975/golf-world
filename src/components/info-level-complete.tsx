import { Button, Typography } from '@mui/material';
import React from 'react';

function LevelCompletePopup({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  if (!isVisible) return null; // If not visible, don't render anything

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <Typography p={8} color="white" variant="h2">
          Level Complete!
        </Typography>
        <Button color="secondary" variant={'contained'} onClick={onClose}>
          Next Level
        </Button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent background
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popup: {
    padding: '20px',
    borderRadius: '20px',
    border: '2px solid #ffffff94',
    background: 'linear-gradient(45deg, #f2f2f2ba, transparent)',
    backdropFilter: 'blur(6px)',
    textAlign: 'center',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default LevelCompletePopup;
