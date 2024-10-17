//@ts-nocheck
import { useBox } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three'; // Import everything from THREE
import { fragmentShader } from '../../components/shaders/fragmentShader';
import { vertexShader } from '../../components/shaders/vertexShader';
import { grassTexture } from '../../components/textures/grassTexture'; // Import the grass texture

// Define the custom shader material
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

function GrassBlock({ position, color }: { position: [number, number, number]; color: string }) {
  const randomHeight = THREE.MathUtils.randFloat(0.2, 0.5);
  const [ref] = useBox(() => ({ args: [10, randomHeight, 10], position, type: 'Static' }));

  return (
    <mesh ref={ref} position={position} receiveShadow castShadow>
      <boxGeometry args={[10, randomHeight, 10]} />
      <customMaterial attach="material" uTexture={grassTexture} />
    </mesh>
  );
}

export default function GrassGround() {
  const tiles = [];
  const numTilesX = 10;
  const numTilesZ = 20;

  for (let x = 0; x < numTilesX; x++) {
    for (let z = 0; z < numTilesZ; z++) {
      const color = (x + z) % 2 === 0 ? '#39d353' : '#28a745';
      tiles.push(
        <GrassBlock key={`${x}-${z}`} position={[-50 + x * 10, 0, -100 + z * 10]} color={color} />,
      );
    }
  }

  return <group>{tiles}</group>;
}
