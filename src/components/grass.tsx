import { useBox, useCylinder } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader } from './shaders/fragmentShader';
import { vertexShader } from './shaders/vertexShader';
import { grassTexture } from './textures/flag';

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

function GrassBlock({ position }: { position: [number, number, number] }) {
  const randomHeight = THREE.MathUtils.randFloat(0.2, 0.4);

  // Ref for physics box
  const [ref] = useBox(() => ({
    args: [10, randomHeight, 10],
    position,
    type: 'Static',
    contactHardness: 0.5,
  })) as [React.MutableRefObject<THREE.Mesh>, any]; // Correctly destructure the tuple

  return (
    <mesh ref={ref} position={position} receiveShadow castShadow>
      <boxGeometry args={[10, randomHeight, 10]} />
      {/* @ts-ignore */}
      <customMaterial attach="material" uTexture={grassTexture} />
    </mesh>
  );
}

function HoleBlock({ position }: { position: [number, number, number] }) {
  const geometry = createTileWithHole(10, 3);

  const [ref] = useCylinder(() => ({
    args: [3, 3, 0.1, 32],
    position: [position[0], position[1], position[2]],
    type: 'Static',
    collisionFilterGroup: 0,
  })) as [React.MutableRefObject<THREE.Mesh>, any]; // Correctly destructure the tuple

  return (
    <mesh ref={ref} position={position} receiveShadow castShadow rotation={[0, 0, 0]}>
      <primitive attach="geometry" object={geometry} />
      {/* @ts-ignore */}
      <customMaterial attach="material" uTexture={grassTexture} />
    </mesh>
  );
}

// Main ground layout
const GrassGround = ({ holeCoords }: { holeCoords: { x: number; z: number } }) => {
  const tiles = [];
  const numTilesX = 10;
  const numTilesZ = 20;

  for (let x = 0; x < numTilesX; x++) {
    for (let z = 0; z < numTilesZ; z++) {
      const worldX = -50 + x * 10;
      const worldZ = -100 + z * 10;

      // Check if this tile should have the hole (block 5 at the second row)
      const hasHole = x === holeCoords.x && z === holeCoords.z;

      // const color = (x + z) % 2 === 0 ? '#39d353' : '#28a745';
      tiles.push(
        hasHole ? (
          <HoleBlock key={`${x}-${z}`} position={[worldX, 0, worldZ]} />
        ) : (
          <GrassBlock key={`${x}-${z}`} position={[worldX, 0, worldZ]} />
        ),
      );
    }
  }

  return <group>{tiles}</group>;
};

export default GrassGround;
