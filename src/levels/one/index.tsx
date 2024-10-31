import Ball from '@/components/ball/ball';
import FlagWithPole from '@/components/goal-point-flag';
import { useGame } from '@/game-context';
import { useRef } from 'react';
import { Group } from 'three';
import GrassGround from '../../components/grass';
import Rail from './rails';

const LevelOne = () => {
  const groupRef = useRef<Group>(null);
  const holePosition: [number, number, number] = [0, 0, -80];
  const holeCoords = { x: 5, z: 2 };
  const { levelCompleted, setMaxHits, setCurrentLevel, hasFailed } = useGame();

  setMaxHits(2);
  setCurrentLevel(1);

  return (
    <group ref={groupRef}>
      <GrassGround holeCoords={holeCoords} />
      <Rail position={[0, 0, -100]} rotation={[0, Math.PI / 2, 0]} size={[10, 10, 110]} />
      <Rail position={[-50, 1, 0]} size={[10, 10, 200]} />
      <Rail position={[50, 1, 0]} size={[10, 10, 200]} />
      <Rail position={[0, 1, 100]} rotation={[0, Math.PI / 2, 0]} size={[10, 10, 110]} />
      {!levelCompleted && !hasFailed && <Ball holePosition={holePosition} />}

      <FlagWithPole position={holePosition} />
      {/* <MultiplayerBalls />
      <MiniCamera position={[0, -10, 0]} /> */}
    </group>
  );
};

export default LevelOne;
