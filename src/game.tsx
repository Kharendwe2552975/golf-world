import waternormals from '@/assets/Normals/waternormals.jpg';
import { Physics } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';
import { FrontSide, Vector3 } from 'three';
import { useBall } from './components/ball/ball-provider';
import EnergySelector from './components/ball/energy-selector';
import EndMessage from './components/end-message';
import FailMessage from './components/fail-message';
import Leaderboard from './components/multiplayer/leaderboard';
import { Ocean } from './components/ocean';
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
  const { levelCompleted, currentLevel } = useGame();
  const { par, setHasFailed, hasScenery } = useGame();
  const { hits, state } = useBall();

  const hasFailed = hits === par && par !== 0 && state !== 'rolling' && !levelCompleted;
  const finishedGame = currentLevel === 4 && levelCompleted;
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
          {hasScenery && (
            <Ocean
              dimensions={[800, 800]}
              normals={waternormals}
              distortionScale={20}
              size={10}
              options={{
                // defaults
                clipBias: 0,
                alpha: 0.8,
                sunDirection: new Vector3(0.70707, 0.70707, 0),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                eye: new Vector3(0, 0, 0),
                distortionScale: 3.7, // automatically set from "distortionScale" prop
                side: FrontSide,
                fog: true,
              }}
            />
          )}
        </Physics>
        {/* MiniCamera renders here, only during gameplay */}
      </Canvas>
      <EnergySelector />
      {<Leaderboard />}
      {!finishedGame && levelCompleted && <WinMessage />}
      {hasFailed && <FailMessage />}
      {finishedGame && <EndMessage />}
    </>
  );
};

export default Game;
