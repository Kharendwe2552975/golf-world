//@ts-nocheck
import Ball from '@/components/ball/ball';
import { useRef } from 'react';
import { Group } from 'three';
import GrassGround from '../../components/grass';
import Rail from './rails';

const LevelOne = () => {
  const groupRef = useRef<Group>(null);
  const holePosition = [0, 0, -80];

  return (
    <group ref={groupRef}>
      <GrassGround />
      <Rail position={[0, 0, -100]} rotation={[0, Math.PI / 2, 0]} size={[10, 5, 110]} />
      <Rail position={[-50, 1, 0]} />
      <Rail position={[50, 1, 0]} />
      <Rail position={[0, 1, 100]} rotation={[0, Math.PI / 2, 0]} size={[10, 5, 110]} />
      <Ball />
    </group>
  );
};

export default LevelOne;
