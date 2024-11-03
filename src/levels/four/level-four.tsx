import Ball from '@/components/ball/ball';
import FlagWithPole from '@/components/goal-point-flag';
import GrassGround from '@/components/grass';
import MiniCamera from '@/components/mini-camera';
import LevelFourIncline from './incline-plane';
import LevelFourRockyStage from './rocky-stage';
import LevelFourStartStage from './start-stage';

const LevelFour = () => {
  const holePosition: [number, number, number] = [129, 0, 150];
  const holeCoords = { x: 5, z: 5 };

  return (
    <group>
      {/* Lower GrassGround */}
      {/* INCLICNE PLANE */}
      <LevelFourIncline />
      {/* START PLATFORM*/}
      <LevelFourStartStage />

      {/* STAGE 2 PLATFORM */}
      <LevelFourRockyStage />

      {/* GOAL STAGE */}
      <GrassGround
        position={[80, 5, 100]}
        rails={[true, true, true, false]}
        holeCoords={holeCoords}
        numTilesX={10}
        numTilesZ={10}
      />

      {/* Flag with Pole */}
      <FlagWithPole position={holePosition} />

      <Ball holePosition={holePosition} initialPosition={[-150, 70, 50]} />
      <MiniCamera position={[0, 600, 0]} />
    </group>
  );
};

export default LevelFour;
