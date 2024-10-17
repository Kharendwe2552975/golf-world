//@ts-nocheck
import { useSphere } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader } from '../components/shaders/fragmentShader';
import { vertexShader } from '../components/shaders/vertexShader';
import { ballTexture } from '../components/textures/ballTexture';

// Define the custom shader material
const CustomMaterial = shaderMaterial(
  {
    uTexture: ballTexture,
    uLightPosition: new THREE.Vector3(30, 50, 30),
    uLightColor: new THREE.Color(1, 1, 1),
    uAmbientLight: new THREE.Color(0.2, 0.2, 0.2),
  },
  vertexShader,
  fragmentShader,
);

extend({ CustomMaterial });

export default function Ball({ position }: { position: [number, number, number] }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    velocity: [0, 0, -90], // Initial velocity
    args: [2], // radius of the ball
    onCollide: (e) => {
      console.log('Ball collided with:', e.body);
    },
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[2, 32, 32]} />
      <customMaterial attach="material" uTexture={ballTexture} />
    </mesh>
  );
}
