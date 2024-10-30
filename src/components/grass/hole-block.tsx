import { useCylinder } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader } from '../shaders/fragmentShader';
import { vertexShader } from '../shaders/vertexShader';
import { grassTexture } from '../textures/ballTexture';

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

// Create a tile with a circular hole
function createTileWithHole(size: number, holeRadius: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-size / 2, -size / 2);
  shape.lineTo(size / 2, -size / 2);
  shape.lineTo(size / 2, size / 2);
  shape.lineTo(-size / 2, size / 2);
  shape.lineTo(-size / 2, -size / 2);

  // Create a circular hole
  const holePath = new THREE.Path();
  holePath.absellipse(0, 0, holeRadius, holeRadius, 0, Math.PI * 2, false);
  shape.holes.push(holePath);

  const extrudeSettings = { depth: 0.1, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  geometry.rotateZ(Math.PI / 2);
  geometry.rotateX(Math.PI / 2);

  return geometry;
}

function HoleBlock({ position }: { position: [number, number, number] }) {
  const geometry = createTileWithHole(10, 3);

  const [ref] = useCylinder(() => ({
    args: [3, 3, 0.1, 32],
    position,
    type: 'Static',
    collisionFilterGroup: 0,
  })) as [React.MutableRefObject<THREE.Mesh>, any];

  return (
    <mesh ref={ref} position={position} receiveShadow castShadow>
      <primitive attach="geometry" object={geometry} />
      {/* @ts-ignore */}
      <customMaterial attach="material" uTexture={grassTexture} />
    </mesh>
  );
}

export default HoleBlock;
