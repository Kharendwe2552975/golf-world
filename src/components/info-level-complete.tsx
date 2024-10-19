import React from 'react';

function LevelCompletePopup({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  if (!isVisible) return null; // If not visible, don't render anything

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h1>Level Complete!</h1>
        <button onClick={onClose} style={styles.button}>
          Next Level
        </button>
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
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
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
