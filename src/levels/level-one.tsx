import Ball from '@/components/ball/ball';
import FlagWithPole from '@/components/goal-point-flag';
import GrassGround from '@/components/grass';
import MiniCamera from '@/components/mini-camera';
import { useGame } from '@/game-context';

const LevelOne = () => {
  const holePosition: [number, number, number] = [0, 0, -80];
  const holeCoords = { x: 5, z: 2 };
  const { levelCompleted } = useGame();
  return (
    <group>
      <GrassGround holeCoords={holeCoords} rails={[true, true, true, true]} />
      {!levelCompleted && <Ball holePosition={holePosition} />}
      <FlagWithPole position={holePosition} />
      {/* <MultiplayerBalls /> */}
      <MiniCamera />
    </group>
  );
};

export default LevelOne;
