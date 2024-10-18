import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

function Hill({ position }: { position: [number, number, number] }) {
  // Load the heightmap image using TextureLoader
  const heightMap = useLoader(
    THREE.TextureLoader,
    'https://upload.wikimedia.org/wikipedia/commons/c/c8/Hand_made_terrain_heightmap.png',
  );
  const normalMap = useLoader(THREE.TextureLoader, '/Normals/hill-normals.png');

  const hillThickness = 10; // Height of the vertical side planes
  // Adjust plane geometry dimensions based on the heightmap
  const width = 100;
  const height = 100;
  const segments = 128; // Increase segments for better resolution

  return (
    <group position={position} scale={3}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, height, segments, segments]} />
        {/* Add a displacement map to simulate the heightmap */}
        <meshStandardMaterial
          color="green"
          wireframe={false}
          displacementMap={heightMap}
          normalMap={normalMap}
          displacementScale={10} // Adjust to control the height of the terrain
        />
      </mesh>

      {/* Vertical side planes for thickness */}
      <mesh position={[-width / 2, -hillThickness / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[width, hillThickness]} />
        <meshStandardMaterial color={'#8B4513'} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[width / 2, -hillThickness / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[width, hillThickness]} />
        <meshStandardMaterial color={'#8B4513'} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, -hillThickness / 2, -width / 2]} rotation={[0, 0, 0]}>
        <planeGeometry args={[width, hillThickness]} />
        <meshStandardMaterial color={'#8B4513'} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, -hillThickness / 2, width / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, hillThickness]} />
        <meshStandardMaterial color={'#8B4513'} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default Hill;
