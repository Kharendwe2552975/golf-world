import waternormals from '@/assets/Normals/waternormals.jpg';
import Ball from '@/components/ball/ball';
import FlagWithPole from '@/components/goal-point-flag';
import GrassGround from '@/components/grass';
import MiniCamera from '@/components/mini-camera';
import { Ocean } from '@/components/ocean';
import { useGame } from '@/game-context';
import { FrontSide, Vector3 } from 'three';
import LevelFourIncline from './incline-plane';
import LevelFourRockyStage from './rocky-stage';
import LevelFourStartStage from './start-stage';

const LevelFour = () => {
  const holePosition: [number, number, number] = [129, 0, 150];
  const holeCoords = { x: 5, z: 5 };
  const { levelCompleted, setPar } = useGame();

  setPar(8);

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

      {/* Ocean */}
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

      {!levelCompleted && <Ball holePosition={holePosition} initialPosition={[-150, 70, 50]} />}
      <MiniCamera position={[0, 600, 0]} />
    </group>
  );
};

export default LevelFour;
