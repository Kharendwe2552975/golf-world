import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const RotatingCylinder = ({
  position = [0, 5, 0],
  speed = 0.1,
}: {
  position: [number, number, number];
  speed: number;
}) => {
  const verticalCylinderRef = useRef();
  const horizontalCylinderRef = useRef();
  // Rotate the horizontal cylinder around the vertical cylinder
  useFrame(() => {
    if (horizontalCylinderRef.current) {
      // @ts-ignore
      horizontalCylinderRef.current.rotation.y += speed; // Adjust rotation speed if needed
    }
  });

  return (
    <>
      {/* Vertical Cylinder */}
      {/* @ts-ignore */}
      <mesh ref={verticalCylinderRef} position={position} castShadow>
        <cylinderGeometry args={[10, 10, 10, 32]} /> {/* Small vertical cylinder */}
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Horizontal Cylinder (rotating around vertical cylinder) */}
      <mesh
        //@ts-ignore
        ref={horizontalCylinderRef}
        position={position}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[5, 5, 50, 32]} /> {/* Long thin horizontal cylinder */}
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
};

export default RotatingCylinder;
