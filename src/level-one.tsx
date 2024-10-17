//@ts-nocheck
import { Physics, usePlane } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { FrontSide, Group, Vector3 } from 'three';
import Ball from './components/ball';
import Hill from './components/hill';
import { Ocean } from './components/ocean';
import Sky from './models/sky';
import Model from './utils/import-model';

function BoundaryPlane({ position, rotation }) {
  const [ref] = usePlane(() => ({
    position,
    rotation,
    isTrigger: true, // Set to trigger to detect collision without affecting physics
  }));

  return null; // Invisible plane used for collision detection
}

function getRandomPositionWithinHill(hillWidth: number, hillHeight: number) {
  // Generate random positions, round them, and ensure they are positive
  const x = Math.floor(Math.abs(Math.random() * hillWidth)); // Random positive integer x
  const z = Math.floor(Math.abs(Math.random() * hillHeight)); // Random positive integer z
  const y = 30; // Fixed y value, you can adjust this based on hill height logic if needed
  return [x, y, z];
}

function Forest({ density }: { density: number }) {
  const hillWidth = 20; // Width of the hill
  const hillHeight = 20; // Height of the hill

  // Generate random tree positions using useMemo for optimization
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < density; i++) {
      positions.push(getRandomPositionWithinHill(hillWidth, hillHeight));
    }
    return positions;
  }, [density]);
  console.log(treePositions);

  return (
    <>
      {treePositions.map((position, index) => (
        <Model key={index} url={'./tree-tall.glb'} scale={10} position={position} />
      ))}
    </>
  );
}

const GolfGround = () => {
  const groupRef = useRef<Group>(null);
  const ocean = useRef();
  return (
    <Canvas
      camera={{ position: [0, 80, 150], fov: 60 }}
      shadows
      style={{ height: '100vh', width: '100vw' }}
    >
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={200}
        minPolarAngle={0} // Prevent the camera from rotating below the horizon
        maxPolarAngle={(Math.PI - 0.2) / 2}
      />
      <Sky />
      <ambientLight intensity={0.4} />
      <spotLight position={[30, 60, 30]} angle={0.5} penumbra={0.5} intensity={1} castShadow />
      <pointLight position={[-20, 40, -20]} intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Physics gravity={[0, -9.81, 0]}>
        <group ref={groupRef}>
          {/* Ocean Surface */}
          <Ocean
            ref={ocean}
            dimensions={[500, 500]}
            normals="./Normals/waternormals.jpg"
            distortionScale={20}
            size={10}
            options={{
              // defaults
              clipBias: 0,
              alpha: 0.8,
              waterNormals: null, // automatically set to provided texture from "normals" prop
              sunDirection: new Vector3(0.70707, 0.70707, 0),
              sunColor: 0xffffff,
              waterColor: 0x001e0f,
              eye: new Vector3(0, 0, 0),
              distortionScale: 3.7, // automatically set from "distortionScale" prop
              side: FrontSide,
              fog: true,
            }}
          />
          <Hill scaleFactor={2} />
          <Forest density={3} />
        </group>
        <Ball position={[0, 30, 0]} />
      </Physics>
    </Canvas>
  );
};

export default GolfGround;
