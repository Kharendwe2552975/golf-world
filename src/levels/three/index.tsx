import waternormals from '@/assets/Normals/waternormals.jpg';
import Ball from '@/components/ball/ball';
import FlagWithPole from '@/components/goal-point-flag';
import GrassGround from '@/components/grass';
import MiniCamera from '@/components/mini-camera';
import { Ocean } from '@/components/ocean';
import { useGame } from '@/game-context';
import Plane from '@/levels/three/plane';
import { FrontSide, Vector3 } from 'three';
import RotatingCylinder from './rotating-cylinder';

const LevelThree = () => {
  const holePosition: [number, number, number] = [0, 25, -355];
  const holeCoords = { x: 5, z: 2 };
  const { levelCompleted } = useGame();

  return (
    <group>
      {/* Lower GrassGround */}
      <GrassGround position={[-50, 0, -100]} rails={[true, true, false, true]} />

      {/* Inclined Plane */}
      <Plane size={[120, 100]} position={[-5, 10, -135]} rotation={[Math.PI / 15, 0, 0]} />

      {/* Upper GrassGround with Hole */}
      <GrassGround
        position={[-50, 20, -375]}
        holeCoords={holeCoords}
        rails={[false, true, true, true]}
      />

      {/* Flag with Pole */}
      <FlagWithPole position={holePosition} />

      {/* Rotating Cylinders */}
      <RotatingCylinder position={[0, 0, -60]} speed={0.05} />

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

      <Ball holePosition={holePosition} />
      <MiniCamera />
    </group>
  );
};

export default LevelThree;
