import { useSphere } from '@react-three/cannon';
import { useEffect, useState } from 'react';
import AimingArrow from './aiming-arrow';
import { useBall } from './ball-provider';
import CameraController from './camera-controller';

const Ball = () => {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 10, 0],
    velocity: [0, 0, 0],
    args: [2],
    material: { friction: 1.0 },
  }));

  const { position, setPosition, applyApi } = useBall();
  const [showAimingArrow, setShowAimingArrow] = useState(false);
  useEffect(() => {
    applyApi(api);

    const unsubscribePosition = api.position.subscribe((pos) => {
      setPosition([pos[0], pos[1], pos[2]]);
    });

    const unsubscribeVelocity = api.velocity.subscribe((velocity) => {
      const isStationary = velocity.every((v) => Math.abs(v) < 0.5);
      setShowAimingArrow(isStationary);
    });

    return () => {
      unsubscribePosition(); // Clean up subscription
      unsubscribeVelocity(); // Clean up subscription
    };
  }, [api, setPosition, applyApi]);

  return (
    <>
      {/* @ts-ignore */}
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {showAimingArrow && <AimingArrow position={position} />}
      <CameraController />
    </>
  );
};

export default Ball;
