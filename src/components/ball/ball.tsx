/* eslint-disable react-hooks/exhaustive-deps */
import { useGame } from '@/game-context';
import { useSphere } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';
import { fragmentShader } from '../shaders/fragmentShader';
import { vertexShader } from '../shaders/vertexShader';
import { ballTexture } from '../textures/ballTexture';
import AimingArrow from './aiming-arrow';
import { useBall } from './ball-provider';
import CameraController from './camera-controller';

// Define the custom shader material
const CustomMaterial = shaderMaterial(
  {
    uTexture: ballTexture,
    uLightPosition: new THREE.Vector3(30, 50, 30),
    uLightColor: new THREE.Color(1, 1, 1),
    uAmbientLight: new THREE.Color(0.2, 0.2, 0.2),
  },
  vertexShader,
  fragmentShader,
);

extend({ CustomMaterial });

const Ball: React.FC<{
  holePosition: [number, number, number];
  initialPosition?: [number, number, number];
}> = ({ holePosition, initialPosition = [0, 10, 80] }) => {
  const [position, setPosition] = useState<[number, number, number]>(initialPosition);
  const [ref, api] = useSphere(() => ({
    mass: 0.045,
    position: initialPosition,
    args: [2],
    material: {
      friction: 0.1,
      restitution: 0.1,
      rollingFriction: 0.05,
    },
    linearDamping: 0.3,
    angularDamping: 0.4,
    airResistance: 0.01,
  }));

  const { setLevelCompleted } = useGame();
  const { state, setState, lastStationaryPosition, setLastStationaryPosition, applyApi } =
    useBall();

  const applyApiStable = useCallback(() => applyApi(api), [api, applyApi]);

  useEffect(() => {
    applyApiStable();

    const tolerance = 0.1;
    const maxYThreshold = -20;

    const unsubscribePosition = api.position.subscribe((pos) => {
      const newPos: [number, number, number] = [pos[0], pos[1], pos[2]];

      // Update position if change exceeds tolerance
      if (
        Math.abs(newPos[0] - position[0]) > tolerance ||
        Math.abs(newPos[1] - position[1]) > tolerance ||
        Math.abs(newPos[2] - position[2]) > tolerance
      ) {
        setPosition(newPos);
      }

      // Check if the ball is within the hole area
      if (pos[1] < 0) {
        const distanceToHole = Math.sqrt(
          (pos[0] - holePosition[0]) ** 2 + (pos[2] - holePosition[2]) ** 2,
        );
        if (distanceToHole < 4) {
          setLevelCompleted(true);
        }
      }

      // Reset ball if it falls too low
      if (pos[1] < maxYThreshold) {
        api.velocity.set(0, 0, 0);
        api.position.set(...lastStationaryPosition);
        api.velocity.set(0, 0, 0);
        setState('aiming');
      }
    });

    const unsubscribeVelocity = api.velocity.subscribe((velocity) => {
      const isStationary = velocity.every((v) => Math.abs(v) < 0.5);
      if (state === 'rolling' && isStationary) {
        setState('aiming');
        setLastStationaryPosition(position);
      }
    });

    return () => {
      unsubscribePosition();
      unsubscribeVelocity();
    };
  }, [applyApiStable, state, holePosition, lastStationaryPosition]); // Position is managed by state itself here

  return (
    <>
      {/* @ts-ignore */}
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[2, 32, 32]} />
        {/* @ts-ignore */}
        <customMaterial attach="material" uTexture={ballTexture} />
      </mesh>

      {state !== 'rolling' && <AimingArrow position={position} />}
      <CameraController ballPosition={position} />
    </>
  );
};

export default Ball;
