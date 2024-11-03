import Ball from '@/components/ball/ball';
import FlagWithPole from '@/components/goal-point-flag';
import GrassGround from '@/components/grass';
import MiniCamera from '@/components/mini-camera';
import Plane from '@/levels/three/plane';
import RotatingPlank from './rotating-plank';

const LevelThree = () => {
  const holePosition: [number, number, number] = [0, 20, -355];
  const holeCoords = { x: 5, z: 2 };

  return (
    <group position={[0, 0, 20]}>
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
      <RotatingPlank size={[80, 10, 10]} position={[0, 0, -50]} rotationSpeed={0.01} />

      <Ball holePosition={holePosition} />
      <MiniCamera position={[-100, 800, 400]} />
    </group>
  );
};

export default LevelThree;
