// Import audio files
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

const Ball = ({ holePosition }: { holePosition: [number, number, number] }) => {
  const [position, setPosition] = useState<[number, number, number]>([0, 10, 80]);
  const [ref, api] = useSphere(() => ({
    mass: 0.045,
    position: [0, 10, 80],
    velocity: [0, 0, 0],
    args: [2],
    material: {
      friction: 0.1,
      restitution: 0.1, // Bounciness
      rollingFriction: 0.05,
    },
    linearDamping: 0.3, // To slow down rolling
    angularDamping: 0.4, // To slow down rolling
    airResistance: 0.01,
    // onCollide: () => {
    //   hitAudio.play().catch((error) => {
    //     console.error('Failed to play hit sound:', error);
    //   });
    // },
  }));

  const { setLevelCompleted } = useGame();
  const { state, setState, lastStationaryPosition, setLastStationaryPosition, applyApi } =
    useBall();
  // Use useCallback to ensure applyApi is not re-created on every render
  const stableApplyApi = useCallback(() => applyApi(api), [api, applyApi]);
  useEffect(() => {
    stableApplyApi();

    const unsubscribePosition = api.position.subscribe((pos) => {
      const tolerance = 0.1; // Higher error tolerance better performance

      const newPos: [number, number, number] = [pos[0], pos[1], pos[2]];
      if (
        Math.abs(newPos[0] - position[0]) > tolerance ||
        Math.abs(newPos[1] - position[1]) > tolerance ||
        Math.abs(newPos[2] - position[2]) > tolerance
      ) {
        setPosition(newPos);
      }

      if (pos[1] < 0) {
        const distanceToHole = Math.sqrt(
          (pos[0] - holePosition[0]) ** 2 + (pos[2] - holePosition[2]) ** 2,
        );
        if (distanceToHole < 4) {
          setLevelCompleted(true);
        }
      }

      if (pos[1] < -20) {
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
  }, [stableApplyApi, state, position, lastStationaryPosition, holePosition]); // Avoid passing large objects as dependencies

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
