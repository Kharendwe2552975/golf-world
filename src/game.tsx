import { Physics } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnergySelector from './components/ball/energy-selector';
import LevelCompletePopup from './components/info-level-complete';
import LevelOne from './levels/one';
import Level2 from './levels/two';
import Sky from './models/sky';

const GetLevel = ({ level, increaseScore }: { level: number; increaseScore: () => void }) => {
  return level == 1 ? (
    <LevelOne increaseScore={increaseScore} />
  ) : (
    <Level2 increaseScore={increaseScore} />
  );
};

const Game = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const navigate = useNavigate();

  const handleQuitGame = () => {
    setScore(0);
    setLevel(1);
    navigate('/');
  };

  // Simulate level completion (replace with actual game logic)
  const completeLevel = () => {
    setIsLevelComplete(true);
    setScore(0);
    setLevel(2);
  };

  // Function to hide the popup and move to the next level (or reset)
  const nextLevel = () => {
    setIsLevelComplete(false);

    // Logic for starting the next level goes here
  };
  // Function to update score (this would be based on your game logic)
  const increaseScore = () => {
    setScore(score + 1);
    if (score == 10) {
      completeLevel();
    }
  };
  return (
    <>
      <Canvas
        camera={{ position: [0, 80, 80], fov: 60 }}
        shadows
        style={{ height: '100vh', width: '100vw' }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={500}
          minPolarAngle={0} // Prevent the camera from rotating below the horizon
          maxPolarAngle={(Math.PI - 0.2) / 2}
        />
        <Sky />
        <ambientLight intensity={0.4} />
        <spotLight position={[30, 60, 30]} angle={0.5} penumbra={0.5} intensity={1} castShadow />
        <pointLight position={[-20, 40, -20]} intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Physics gravity={[0, -9.81, 0]}>
          <GetLevel level={level} increaseScore={increaseScore} />
        </Physics>
      </Canvas>
      <EnergySelector />
      <div
        style={{
          fontFamily: 'Roboto, sans-serif',
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
        }}
      >
        <h1>Score: {score}</h1>
      </div>

      {/* Simulate score update */}
      <button
        onClick={handleQuitGame}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          padding: '10px 20px',
          fontSize: '16px',
        }}
      >
        Quit
      </button>
      <LevelCompletePopup isVisible={isLevelComplete} onClose={nextLevel} />
    </>
  );
};

export default Game;
