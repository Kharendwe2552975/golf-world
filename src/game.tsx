import { Physics } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';
import { useBall } from './components/ball/ball-provider';
import EnergySelector from './components/ball/energy-selector';
import FailMessage from './components/fail-message';
import Leaderboard from './components/multiplayer/leaderboard';
import WinMessage from './components/win-message';
import { useGame } from './game-context';
import LevelFour from './levels/four/level-four';
import LevelOne from './levels/level-one';
import LevelTwo from './levels/level-two';
import LevelThree from './levels/three';
import Sky from './models/sky';

const GetLevel = () => {
  const { currentLevel } = useGame();
  switch (currentLevel) {
    case 1:
      return <LevelOne />;
    case 2:
      return <LevelTwo />;
    case 3:
      return <LevelThree />;
    case 4:
      return <LevelFour />;
    default:
      return <LevelOne />;
  }
};

const Game = () => {
  const { levelCompleted } = useGame();
  const { par, setHasFailed } = useGame();
  const { hits, state } = useBall();

  const hasFailed = hits === par && par !== 0 && state !== 'rolling';

  useEffect(() => {
    if (hasFailed) {
      setHasFailed(true);
    }
  }, [hasFailed, setHasFailed]);

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
        <Physics gravity={[0, -20, 0]}>
          <GetLevel />
        </Physics>
        {/* MiniCamera renders here, only during gameplay */}
      </Canvas>
      <EnergySelector />
      {<Leaderboard />}
      {levelCompleted && <WinMessage />}
      {hasFailed && <FailMessage />}
    </>
  );
};

export default Game;
