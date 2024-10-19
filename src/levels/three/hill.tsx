import { useHeightfield } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Mesh } from 'three';

function convertTo2DArray(data: Float32Array, width: number, height: number): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < height; i++) {
    const row: number[] = [];
    for (let j = 0; j < width; j++) {
      row.push(data[i * width + j]);
    }
    result.push(row);
  }
  return result;
}

function Hill({ position }: { position: [number, number, number] }) {
  // Load the heightmap and normal map using TextureLoader
  const heightMap = useLoader(THREE.TextureLoader, '/Textures/heightmap2.png');
  const normalMap = useLoader(THREE.TextureLoader, '/Normals/hill-normals.png');

  const hillThickness = 10; // Height of the vertical side planes
  const width = 100;
  const height = 100;
  const segments = 128; // More segments for better resolution

  // Create Float32Array to store height data
  const heightData = new Float32Array(segments * segments);

  // Get image data from the heightMap to populate heightData
  const img = heightMap.image as HTMLImageElement; // Assuming the image has loaded
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);
  const imgData = context.getImageData(0, 0, img.width, img.height).data;

  // Fill heightData with normalized values from the image
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      const idx = (i + j * img.width) * 4;
      heightData[i + j * segments] = (imgData[idx] / 255) * 10; // Normalize height values
    }
  }

  // Convert the heightData to a 2D array as expected by useHeightfield
  const heightData2D = convertTo2DArray(heightData, segments, segments);

  // Create a heightfield physics object using useHeightfield
  const [ref] = useHeightfield(() => ({
    args: [heightData2D, { elementSize: width / segments }],
    position,
    rotation: [-Math.PI / 2, 0, 0],
    scale: 3,
  }));

  // Create a reference for the mesh
  const meshRef = useRef<Mesh>(null);

  return (
    <group position={position} scale={3}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, height, segments, segments]} />
        <meshStandardMaterial
          color="green"
          wireframe={false}
          displacementMap={heightMap}
          normalMap={normalMap}
          displacementScale={20} // Adjust to control the height of the terrain
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
