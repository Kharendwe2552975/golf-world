import { useBox, useHingeConstraint } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';

interface RotatingPlankProps {
  size?: [number, number, number];
  position?: [number, number, number];
  rotationSpeed?: number; // Speed of rotation
}

const RotatingPlank: React.FC<RotatingPlankProps> = ({
  size = [50, 2, 10],
  position = [-20, 20, -100],
  rotationSpeed = 0.01,
}) => {
  const [plankRef, api] = useBox(() => ({
    position,
    rotation: [0, 0, 0],
    args: size,
    dynamic: true,
    type: 'Dynamic',
  }));

  // Hinge constraint for rotating the plank around its center
  useHingeConstraint(plankRef, null, {
    pivotA: [0, 0, 0],
    axisA: [0, 1, 0], // Rotate around the Y-axis
  });

  const angleRef = useRef(0);

  useFrame(() => {
    angleRef.current += rotationSpeed;
    api.rotation.set(0, angleRef.current, 0);
  });
  return (
    //@ts-ignore
    <mesh ref={plankRef} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="brown" />
    </mesh>
  );
};

export default RotatingPlank;
