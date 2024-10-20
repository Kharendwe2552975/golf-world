//@ts_nocheck
import { useBox, useCylinder } from '@react-three/cannon';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader } from '../../components/shaders/fragmentShader';
import { vertexShader } from '../../components/shaders/vertexShader';
import { grassTexture } from '../../components/textures/grassTexture'; // Import the grass texture

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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      //@ts-ignore
      customMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

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

// GrassBlock component with the hole implemented here
function GrassBlock({
  position,
  hasHole,
}: {
  position: [number, number, number];
  color: string;
  hasHole: boolean;
}) {
  const randomHeight = THREE.MathUtils.randFloat(0.2, 0.5);

  // Ref for physics box or cylinder
  let ref: React.MutableRefObject<THREE.Mesh>;
  let geometry: THREE.BufferGeometry;

  if (hasHole) {
    geometry = createTileWithHole(10, 3); // Create tile geometry with a hole
    //@ts-ignore
    // Physics cylinder for the hole to allow ball to fall through
    [ref] = useCylinder(() => ({
      args: [3, 3, 0.1, 32],
      position: [position[0], position[1], position[2]],
      type: 'Static',
      collisionFilterGroup: 0,
    })) as [React.MutableRefObject<THREE.Mesh>];
  } else {
    // Use box geometry for normal tiles
    geometry = new THREE.BoxGeometry(10, randomHeight, 10);
    //@ts-ignore
    [ref] = useBox(() => ({
      args: [10, randomHeight, 10],
      position,
      type: 'Static',
    })) as [React.MutableRefObject<THREE.Mesh>];
  }

  return (
    <mesh ref={ref} position={position} receiveShadow castShadow rotation={[0, 0, 0]}>
      <primitive attach="geometry" object={geometry} />
      <customMaterial attach="material" uTexture={grassTexture} />
    </mesh>
  );
}

// Main ground layout
export default function GrassGround() {
  const tiles = [];
  const numTilesX = 10; // Number of tiles horizontally
  const numTilesZ = 20; // Number of tiles vertically
  const holePosition = { x: 5, z: 2 }; // Block number 5 at the second row (z = 1)

  for (let x = 0; x < numTilesX; x++) {
    for (let z = 0; z < numTilesZ; z++) {
      const worldX = -50 + x * 10;
      const worldZ = -100 + z * 10;

      // Check if this tile should have the hole (block 5 at the second row)
      const hasHole = x === holePosition.x && z === holePosition.z;

      const color = (x + z) % 2 === 0 ? '#39d353' : '#28a745';
      tiles.push(
        <GrassBlock
          key={`${x}-${z}`}
          position={[worldX, 0, worldZ]}
          color={color}
          hasHole={hasHole}
        />,
      );
    }
  }

  return <group>{tiles}</group>;
}
