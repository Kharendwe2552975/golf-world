import { useSphere } from '@react-three/cannon';
import { useCallback, useEffect, useRef } from 'react';
import { Mesh } from 'three';
import AimingArrow from './aiming-arrow';
import { useBall } from './ball-provider';
import CameraController from './camera-controller';

const Ball = ({
  increaseScore,
  init_position = [0, 10, 80],
}: {
  increaseScore: () => void;
  init_position: [number, number, number];
}) => {
  // Ref type corrected for Mesh
  const ref = useRef<Mesh>(null);

  const [_, api] = useSphere(
    () => ({
      mass: 0.045,
      position: init_position,
      args: [2],
      material: {
        friction: 0.1,
        restitution: 0.1,
        rollingFriction: 0.05,
      },
      linearDamping: 0.3,
      angularDamping: 0.4,
      airResistance: 0.01,
    }),
    ref,
  ); // Pass the ref here

  const {
    state,
    setState,
    position,
    setPosition,
    lastStationaryPosition,
    setLastStationaryPosition,
    applyApi,
  } = useBall();

  const stableApplyApi = useCallback(() => applyApi(api), [api, applyApi]);

  useEffect(() => {
    stableApplyApi();

    const unsubscribePosition = api.position.subscribe((pos) => {
      setPosition([pos[0], pos[1], pos[2]]);

      if (pos[1] < 0) {
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
        increaseScore();
      }
    });

    return () => {
      unsubscribePosition();
      unsubscribeVelocity();
    };
  }, [
    state,
    setPosition,
    stableApplyApi,
    position,
    lastStationaryPosition,
    setLastStationaryPosition,
    increaseScore,
  ]);
  return (
    <>
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {state !== 'rolling' && <AimingArrow position={position} />}
      <CameraController />
    </>
  );
};

export default Ball;
