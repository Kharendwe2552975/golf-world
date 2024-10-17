//@ts-nocheck
import Ball from '@/components/ball';
import FlagWithPole from '@/components/goal-point-flag';
import { useRef } from 'react';
import { Group } from 'three';
import GrassGround from './grass';
import { Rail } from './rails'; // Import the unified Rail component

const LevelOne = () => {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      <GrassGround />
      {/* Use the Rail component with type prop */}
      <Rail position={[0, 0, -100]} type="front" />
      <Rail position={[-50, 1, 0]} type="side" />
      <Rail position={[50, 1, 0]} type="side" />
      <Rail position={[0, 1, 100]} type="front" />
      <FlagWithPole position={[0, 0, -80]} />
      <Ball position={[0, 10, 0]} />
    </group>
  );
};

export default LevelOne;
