import { useSphere } from '@react-three/cannon';
import { useCallback, useEffect } from 'react';
import AimingArrow from './aiming-arrow';
import { useBall } from './ball-provider';
import CameraController from './camera-controller';

const Ball = () => {
  const [ref, api] = useSphere(() => ({
    mass: 0.045,
    position: [0, 10, 80],
    args: [2],
    material: {
      friction: 0.1,
      restitution: 0.1, // Bounciness
      rollingFriction: 0.05,
    },
    linearDamping: 0.3, // To slow down rolling
    angularDamping: 0.4, // To slow down rolling
    airResistance: 0.01,
  }));

  const {
    state,
    setState,
    position,
    setPosition,
    lastStationaryPosition,
    setLastStationaryPosition,
    applyApi,
  } = useBall();

  // Use useCallback to ensure applyApi is not re-created on every render
  const stableApplyApi = useCallback(() => applyApi(api), [api, applyApi]);

  useEffect(() => {
    stableApplyApi();

    const unsubscribePosition = api.position.subscribe((pos) => {
      setPosition([pos[0], pos[1], pos[2]]);

      // Check if the ball is out of bounds
      if (pos[1] < 0) {
        // Reset the ball to the last stationary position
        api.position.set(...lastStationaryPosition);
        api.velocity.set(0, 0, 0); // Stop any movement
        setState('aiming');
      }
    });

    const unsubscribeVelocity = api.velocity.subscribe((velocity) => {
      const isStationary = velocity.every((v) => Math.abs(v) < 0.5);
      if (state === 'rolling' && isStationary) {
        setState('aiming');
        setLastStationaryPosition(position); // Set last stationary position
      }
    });

    return () => {
      unsubscribePosition(); // Clean up subscription
      unsubscribeVelocity(); // Clean up subscription
    };
  }, [
    state,
    setPosition,
    stableApplyApi,
    position,
    lastStationaryPosition,
    setLastStationaryPosition,
  ]);

  return (
    <>
      {/* @ts-ignore */}
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
