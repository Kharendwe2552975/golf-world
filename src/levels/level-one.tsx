import Ball from '@/components/ball/ball';
import FlagWithPole from '@/components/goal-point-flag';
import GrassGround from '@/components/grass';
import MiniCamera from '@/components/mini-camera';
import { useGame } from '@/game-context';

const LevelOne = () => {
  const holePosition: [number, number, number] = [0, 0, -80];
  const holeCoords = { x: 5, z: 2 };
  const { setPar, hasFailed } = useGame();

  setPar(2);
  return (
    <group>
      <GrassGround holeCoords={holeCoords} rails={[true, true, true, true]} />
      {!hasFailed && <Ball holePosition={holePosition} />}
      <FlagWithPole position={holePosition} />
      {/* <MultiplayerBalls /> */}
      <MiniCamera position={[0, 600, 0]} />
    </group>
  );
};

export default LevelOne;
