import { useGame } from '@/game-context';
import { useSphere } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';

import AimingArrow from '../ball/aiming-arrow';
import { useBall } from '../ball/ball-provider';
import CameraController from '../ball/camera-controller';
import { fragmentShader } from '../shaders/fragmentShader';
import { vertexShader } from '../shaders/vertexShader';
import { ballTexture } from '../textures/ballTexture';
import { greenBallTexture } from '../textures/greenBallTexture';
import { orangeBallTexture } from '../textures/orangeBallTexture';
import { purpleBallTexture } from '../textures/purpleBallTexture';
import { redBallTexture } from '../textures/redBallTexture';

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

const Ball = ({
  holePosition,
  initialPosition = [0, 10, 80],
}: {
  holePosition: [number, number, number];
  initialPosition?: [number, number, number];
}) => {
  const [position, setPosition] = useState<[number, number, number]>(initialPosition);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [ref, api] = useSphere(() => ({
    mass: 0.045,
    position: initialPosition,
    velocity: [0, 0, 0],
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

  const { levelCompleted, setLevelCompleted } = useGame();
  const { state, setState, lastStationaryPosition, setLastStationaryPosition, applyApi, texture } =
    useBall();

  const stableApplyApi = useCallback(() => applyApi(api), [api, applyApi]);

  useEffect(() => {
    stableApplyApi();

    const unsubscribePosition = api.position.subscribe((pos) => {
      const tolerance = 0.1;
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
        if (distanceToHole < 10) {
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
  }, [stableApplyApi, state, position, lastStationaryPosition, holePosition]);

  const getTexture = (texture: string) => {
    switch (texture) {
      case '/redBall.png':
        return redBallTexture;
      case '/greenBall.png':
        return greenBallTexture;
      case '/orangeBall.png':
        return orangeBallTexture;
      case '/purpleBall.png':
        return purpleBallTexture;
      default:
        return ballTexture;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'c' || event.key === 'C') {
        setIsCameraActive((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* @ts-ignore */}
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[2, 32, 32]} />
        {/* @ts-ignore */}
        <customMaterial attach="material" uTexture={getTexture(texture)} />
      </mesh>

      {isCameraActive && state !== 'rolling' && !levelCompleted && (
        <AimingArrow position={position} />
      )}
      {isCameraActive && !levelCompleted && <CameraController ballPosition={position} />}
    </>
  );
};

export default Ball;
