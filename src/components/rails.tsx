//@ts-nocheck
import { useBox } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader } from './shaders/fragmentShader';
import { vertexShader } from './shaders/vertexShader';
import { woodTexture } from './textures/woodTexture';

// Define the custom shader material for wood
const WoodMaterial = shaderMaterial(
  {
    uTexture: woodTexture, // Use the wood texture
    uLightPosition: new THREE.Vector3(30, 50, 30),
    uLightColor: new THREE.Color(1, 1, 1),
    uAmbientLight: new THREE.Color(0.2, 0.2, 0.2),
  },
  vertexShader,
  fragmentShader,
);

extend({ WoodMaterial });

export default function Rail({
  position,
  rotation = [0, 0, 0],
  size = [10, 10, 200],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
}) {
  const adjustedPosition = [position[0] - 1, position[1], position[2] - 5];

  const [ref] = useBox(() => ({ args: size, position: adjustedPosition, rotation: rotation }));

  return (
    <mesh ref={ref} position={adjustedPosition} rotation={rotation} receiveShadow>
      <boxGeometry args={size} />
      <woodMaterial attach="material" uTexture={woodTexture} /> {/* Use the wood texture */}
    </mesh>
  );
}
