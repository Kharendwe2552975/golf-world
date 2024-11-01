import { useCylinder } from '@react-three/cannon';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

const RotatingCylinder = ({
  position = [0, 5, 0], // Initial position
  speed = 0.002,
}: {
  position: [number, number, number];
  speed: number;
}) => {
  const [cylinderRef, cylinderApi] = useCylinder(() => ({
    mass: 1,
    position: [position[0], position[1] + 1, position[2]], // Add a small offset in the y-axis
    args: [5, 5, 50, 32],
    rotation: [Math.PI / 2, 0, 0],
    fixedRotation: true,
  }));

  const angleRef = useRef(0);

  const texture = useLoader(
    TextureLoader,
    'https://threejsfundamentals.org/threejs/resources/images/wall.jpg',
  );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  useFrame(() => {
    angleRef.current += speed;

    const radius = 5;
    const x = position[0] + radius * Math.cos(angleRef.current);
    const z = position[2] + radius * Math.sin(angleRef.current);

    // Keep the cylinder a little above the ground
    cylinderApi.position.set(x, position[1] + 1, z); // Maintain the y-offset
    cylinderApi.rotation.set(Math.PI / 2, 0, angleRef.current); // Rotate around z-axis
  });

  return (
    /*@ts-ignore*/
    <mesh ref={cylinderRef} castShadow receiveShadow>
      <cylinderGeometry args={[5, 5, 50, 64]} />
      <meshStandardMaterial map={texture} metalness={0.7} roughness={0.3} color="silver" />
    </mesh>
  );
};

export default RotatingCylinder;
