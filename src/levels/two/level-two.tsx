import { useRef } from 'react';
import { Group } from 'three';
// import GrassGround from '../../components/grass';
import Ball from '@/components/ball/ball';
import FlagWithPole from '@/components/goal-point-flag';
import GrassGround from '@/components/grass';
import Rail from '../one/rails';

const LevelTwo = () => {
  const groupRef = useRef<Group>(null);
  const holePosition: [number, number, number] = [0, 0, -80];
  const holeCoords = { x: 5, z: 2 };

  return (
    <group ref={groupRef}>
      <group scale={[0.5, 1.5, 0.5]} position={[-20, 0, 50]}>
        <GrassGround />
        <Rail position={[-50, 1, -60]} size={[10, 5, 300]} /> {/* Left */}
        <Rail position={[50, 1, -10]} /> {/* Right */}
        {/* <Rail position={[0, 1, -100]} /> Front */}
      </group>

      <group scale={[0.5, 1.5, 0.5]} position={[5, 0, -27]} rotation={[0, Math.PI / 2, 0]}>
        <GrassGround />
        <Rail position={[50, 1, 0]} />
        <Rail position={[-50, 1, 100]} />
        <Rail position={[-245, 1, -50]} size={[10, 5, 110]} />
      </group>

      <group scale={[0.5, 1.5, 0.5]} position={[80, 0, -47]}>
        <GrassGround holeCoords={holeCoords} />
        <FlagWithPole position={holePosition} />
        <Rail position={[50, 1, -5]} size={[10, 5, 200]} />
        <group position={[-100, 0, -0.2]}>
          <Rail position={[50, 1, -55]} size={[10, 5, 100]} />
        </group>
        <group rotation={[0, Math.PI / 2, 0]} position={[-150, 0, -60]}>
          <Rail position={[50, 1, 150]} size={[10, 5, 110]} />
        </group>
      </group>
      <Ball holePosition={holePosition} />
    </group>
  );
};

export default LevelTwo;
