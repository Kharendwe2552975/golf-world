//@ts-nocheck
import Ball from '@/components/ball';
import FlagWithPole from '@/components/goal-point-flag';
import { useRef } from 'react';
import { Group } from 'three';
import GrassGround from './grass';
import { FrontRail, SideRail } from './rails';

const LevelOne = () => {
  const groupRef = useRef<Group>(null);
  const holePosition = [0, 0, -80];
  const initialBallPosition = [0, 10, 70];

  return (
    <group ref={groupRef}>
      <GrassGround />
      <FrontRail position={[0, 0, -100]} />
      <SideRail position={[-50, 1, 0]} />
      <SideRail position={[50, 1, 0]} />
      <FrontRail position={[0, 0, 100]} />
      <FlagWithPole position={[0, 0, -80]} />
      <Ball position={initialBallPosition} holePosition={holePosition} />
    </group>
  );
};

export default LevelOne;
