/* eslint-disable react-hooks/exhaustive-deps */
import { grassTexture } from '@/components/textures/ballTexture'; // Adjust this path as necessary
import type { Triplet } from '@react-three/cannon';
import { useHeightfield } from '@react-three/cannon';
import { useEffect, useRef } from 'react';
import type { BufferGeometry, Mesh } from 'three';
import { Float32BufferAttribute } from 'three';

type GenerateHeightmapArgs = {
  height: number;
  number: number;
  scale: number;
  width: number;
};

/* Generates a 2D array using Worley noise. */
function generateHeightmap({ width, height, number, scale }: GenerateHeightmapArgs) {
  const data = [];

  const seedPoints = [];
  for (let i = 0; i < number; i++) {
    seedPoints.push([Math.random(), Math.random()]);
  }

  let max = 0;
  for (let i = 0; i < width; i++) {
    const row = [];
    for (let j = 0; j < height; j++) {
      let min = Infinity;
      seedPoints.forEach((p) => {
        const distance2 = (p[0] - i / width) ** 2 + (p[1] - j / height) ** 2;
        if (distance2 < min) {
          min = distance2;
        }
      });
      const d = Math.sqrt(min);
      if (d > max) {
        max = d;
      }
      row.push(d);
    }
    data.push(row);
  }

  /* Normalize and scale. */
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      data[i][j] *= scale / max;
    }
  }
  return data;
}

// Function to generate the heightmap remains unchanged

function HeightmapGeometry({
  elementSize,
  heights,
}: {
  elementSize: number;
  heights: number[][];
}): JSX.Element {
  const ref = useRef<BufferGeometry>(null);

  useEffect(() => {
    if (!ref.current) return;
    const dx = elementSize;
    const dy = elementSize;

    const vertices = heights.flatMap((row, i) => row.flatMap((z, j) => [i * dx, j * dy, z]));

    const indices = [];
    for (let i = 0; i < heights.length - 1; i++) {
      for (let j = 0; j < heights[i].length - 1; j++) {
        const stride = heights[i].length;
        const index = i * stride + j;
        indices.push(index + 1, index + stride, index + stride + 1);
        indices.push(index + stride, index + 1, index);
      }
    }

    ref.current.setIndex(indices);
    ref.current.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    ref.current.computeVertexNormals();
    ref.current.computeBoundingBox();
    ref.current.computeBoundingSphere();
  }, [heights]);

  return <bufferGeometry ref={ref} />;
}

function Heightfield({
  elementSize,
  heights,
  position,
  rotation,
}: {
  elementSize: number;
  heights: number[][];
  position: Triplet;
  rotation: Triplet;
}): JSX.Element {
  const [ref] = useHeightfield(
    () => ({
      args: [
        heights,
        {
          elementSize,
        },
      ],
      position,
      rotation,
    }),
    useRef<Mesh>(null),
  );

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <meshStandardMaterial map={grassTexture} />
      <HeightmapGeometry heights={heights} elementSize={elementSize} />
    </mesh>
  );
}

const Surface = ({ position }: { position: [number, number, number] }) => {
  const scale = 30;
  return (
    <>
      <pointLight decay={5} intensity={10 * Math.PI} />
      <spotLight
        angle={Math.PI / 2}
        decay={0}
        penumbra={1}
        position={[10, 100, 300]}
        intensity={0.6 * Math.PI}
        castShadow
      />
      <ambientLight intensity={0.1} />
      <Heightfield
        elementSize={(scale * 1) / 128}
        heights={generateHeightmap({
          height: 800,
          number: 10,
          scale: scale,
          width: 520,
        })}
        position={position}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </>
  );
};

export default Surface;
