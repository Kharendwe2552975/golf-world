import { fragmentShader } from '@/components/shaders/fragmentShader';
import { vertexShader } from '@/components/shaders/vertexShader';
import { woodTexture } from '@/components/textures/woodTexture';
import { useBox } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

import * as THREE from 'three';

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
  size = [10, 5, 200],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number, number];
}) {
  const [ref] = useBox(() => ({ args: size, position: position, rotation: rotation }));

  return (
    <>
      {/* @ts-ignore */}
      <mesh ref={ref} position={position} rotation={rotation} receiveShadow>
        <boxGeometry args={size} />
        {/* @ts-ignore */}
        <woodMaterial attach="material" uTexture={woodTexture} />
      </mesh>
    </>
  );
}
