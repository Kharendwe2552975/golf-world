import Ball from '@/components/ball/ball';
import FlagWithPole from '@/components/goal-point-flag';
import GrassGround from '@/components/grass';
import Rail from '@/components/grass/rail';
import MiniCamera from '@/components/mini-camera';
import { useGame } from '@/game-context';

const LevelTwo = () => {
  const holePosition: [number, number, number] = [200, 0, -330];
  const holeCoords = { x: 5, z: 2 }; // Updated hole coordinates for level two
  const { levelCompleted } = useGame();

  return (
    <group>
      {/* First GrassGround without scaling */}
      <GrassGround
        position={[-50, 0, -100]}
        numTilesX={10}
        numTilesZ={20}
        rails={[true, true, false, true]}
      />
      <GrassGround
        position={[-50, 0, -200]}
        numTilesX={30}
        numTilesZ={10}
        rails={[false, true, false, true]}
      />
      <GrassGround
        holeCoords={holeCoords}
        position={[150, 0, -350]}
        numTilesX={10}
        numTilesZ={15}
        rails={[false, true, true, true]}
      />
      <Rail position={[45, 0, -200]} rotation={[0, Math.PI / 2, 0]} size={[10, 10, 200]} />
      <Rail position={[155, 0, -100]} rotation={[0, Math.PI / 2, 0]} size={[10, 10, 200]} />
      <FlagWithPole position={holePosition} />
      <Ball holePosition={holePosition} />
      <MiniCamera />
    </group>
  );
};

export default LevelTwo;
