import { Physics } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import EnergySelector from './components/ball/energy-selector';
import Leaderboard from './components/multiplayer/leaderboard';
import WinMessage from './components/win-message';
import { useGame } from './game-context';
import LevelOne from './levels/level-one';
import LevelThree from './levels/three/level-three';
import Sky from './models/sky';

const GetLevel = () => {
  const { currentLevel } = useGame();
  switch (currentLevel) {
    case 12:
      return <LevelOne />;
    default:
      return <LevelThree />;
  }
};

const Game = () => {
  const { levelCompleted } = useGame();
  const navigate = useNavigate();
  const handleQuitGame = () => {
    navigate('/');
  };

  return (
    <>
      <Canvas
        camera={{ position: [0, 80, 80], fov: 60 }}
        shadows
        style={{ height: '100vh', width: '100vw' }}
      >
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Sky />
        <ambientLight intensity={0.4} />
        <spotLight position={[30, 60, 30]} angle={0.5} penumbra={0.5} intensity={1} castShadow />
        <pointLight position={[-20, 40, -20]} intensity={0.3} />
        <Physics gravity={[0, -9.81, 0]}>
          <GetLevel />
        </Physics>
      </Canvas>
      <EnergySelector />
      {levelCompleted && <Leaderboard />}
      {levelCompleted && <WinMessage />}
      <button
        onClick={handleQuitGame}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '20px',
          border: '2px solid #ffffff94',
          background: 'linear-gradient(45deg, #f2f2f2ba, transparent)',
          backdropFilter: 'blur(6px)',
        }}
      >
        Quit
      </button>
    </>
  );
};

export default Game;
