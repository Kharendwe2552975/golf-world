//@ts-nocheck
import { useBox } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader } from '../../components/shaders/fragmentShader';
import { vertexShader } from '../../components/shaders/vertexShader';
import { woodTexture } from '../../components/textures/woodTexture'; // Import the wood texture

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

// Unified Rail component
export function Rail({
  position,
  rotation = [0, 0, 0],
  type = 'side', // Accept 'side' or 'front' to determine the rail type
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  type?: 'side' | 'front';
}) {
  const size = type === 'side' ? [10, 2, 200] : [10, 10, 110]; // Set the same height for both types
  const isSide = type === 'side';

  const [ref] = useBox(() => ({
    args: size,
    position,
    rotation: isSide ? rotation : [0, Math.PI / 2, 0],
    type: 'Static',
  }));

  return (
    <>
      {/* Main rail mesh */}
      <mesh
        ref={ref}
        position={position}
        rotation={isSide ? rotation : [0, Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={size} />
        <woodMaterial attach="material" uTexture={woodTexture} /> {/* Use the wood texture */}
      </mesh>

      {/* Render additional mesh only for side rails */}
      {isSide && (
        <mesh
          position={[position[0], position[1] + 1, position[2]]} // Adjust this position as needed
          rotation={rotation}
        >
          <boxGeometry args={size} />
          <woodMaterial attach="material" uTexture={woodTexture} /> {/* Use the wood texture */}
        </mesh>
      )}
    </>
  );
}
