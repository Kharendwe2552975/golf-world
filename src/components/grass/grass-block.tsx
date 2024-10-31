import { grassTexture } from '../textures/flag';

import { useBox } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader } from '../shaders/fragmentShader';
import { vertexShader } from '../shaders/vertexShader';

// Custom shader material
const CustomMaterial = shaderMaterial(
  {
    uTexture: grassTexture,
    uLightPosition: new THREE.Vector3(30, 50, 30),
    uLightColor: new THREE.Color(1, 1, 1),
    uAmbientLight: new THREE.Color(0.2, 0.2, 0.2),
  },
  vertexShader,
  fragmentShader,
);

extend({ CustomMaterial });

// Grass block component with rotation
function GrassBlock({
  position,
  enablePhysics = false,
}: {
  position: [number, number, number];
  enablePhysics?: boolean;
}) {
  // Add physics to the grass block
  if (enablePhysics) {
    useBox(() => ({
      args: [10, 0.1, 10],
      position,
      type: 'Static',
      contactHardness: 0.5,
    }));
  }

  return (
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={[10, 0.1, 10]} />
      {/* @ts-ignore */}
      <customMaterial attach="material" uTexture={grassTexture} />
    </mesh>
  );
}

export default GrassBlock;
