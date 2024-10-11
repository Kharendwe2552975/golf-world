//@ts-nocheck
import { Physics, useBox, useSphere } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, MathUtils } from 'three';
import Sky from './models/sky';

function GrassBlock({ position, color }: { position: [number, number, number]; color: string }) {
  const randomHeight = MathUtils.randFloat(0.2, 0.5);
  const [ref] = useBox(() => ({ args: [10, randomHeight, 10], position, type: 'Static' }));

  return (
    <mesh ref={ref} position={position} receiveShadow castShadow>
      <boxGeometry args={[10, randomHeight, 10]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Flag({ position }: { position: [number, number, number] }) {
  const flagRef = useRef(null);

  useFrame(({ clock }) => {
    if (flagRef.current) {
      const elapsed = clock.getElapsedTime();
      (flagRef.current as any).rotation.z = MathUtils.degToRad(Math.sin(elapsed) * 5);
    }
  });

  return (
    <mesh ref={flagRef} position={position}>
      <planeGeometry args={[12, 7]} />
      <meshStandardMaterial color={'#ff1a1a'} side={2} />
    </mesh>
  );
}

function Pole({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} receiveShadow>
      <cylinderGeometry args={[0.5, 0.5, 72, 32]} />
      <meshStandardMaterial color={'#ffffff'} />
    </mesh>
  );
}

function Hole({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} receiveShadow>
      <cylinderGeometry args={[1.5, 1.5, 1, 32]} />
      <meshStandardMaterial color={'#000000'} />
    </mesh>
  );
}

function GrassGround() {
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

function SideRail({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const [ref] = useBox(() => ({ args: [10, 2, 200], position, rotation, type: 'Static' }));

  return (
    <>
      <mesh ref={ref} position={position} rotation={rotation} receiveShadow>
        <boxGeometry args={[10, 2, 200]} />
        <meshStandardMaterial color={'#8B4513'} />
      </mesh>
      <mesh position={[position[0], position[1] + 1, position[2]]}>
        <boxGeometry args={[10, 0.1, 200]} />
        <meshStandardMaterial color={'#5C3A1D'} />
      </mesh>
    </>
  );
}

function FrontRail({ position }: { position: [number, number, number] }) {
  const [ref] = useBox(() => ({
    args: [10, 20, 110],
    position,
    rotation: [0, Math.PI / 2, 0],
    type: 'Static',
  }));

  return (
    <>
      <mesh ref={ref} position={position} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 20, 110]} />
        <meshStandardMaterial color={'#8B4513'} />
      </mesh>
      <mesh position={[position[0], position[1] + 1, position[2]]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 20, 110]} />
        <meshStandardMaterial color={'#5C3A1D'} />
      </mesh>
    </>
  );
}

function FlagWithPole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Pole position={[0, 7.5, 0]} />
      <Flag position={[5.2, 40, 1]} />
      <Hole position={[0, 0, 0]} />
    </group>
  );
}

function Ball({ position }: { position: [number, number, number] }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    velocity: [0, 0, -90], //Initial velocity
    args: [2], // radius of the ball
    onCollide: (e) => {
      console.log('Ball collided with:', e.body);
    },
  }));

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color={'#ff0000'} />
    </mesh>
  );
}

const GolfGround = () => {
  const groupRef = useRef<Group>(null);

  return (
    <Canvas
      camera={{ position: [0, 80, 150], fov: 60 }}
      shadows
      style={{ height: '100vh', width: '100vw' }}
    >
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Sky />
      <ambientLight intensity={0.4} />
      <spotLight position={[30, 60, 30]} angle={0.5} penumbra={0.5} intensity={1} castShadow />
      <pointLight position={[-20, 40, -20]} intensity={0.3} />

      <Physics gravity={[0, -9.81, 0]}>
        <group ref={groupRef}>
          <GrassGround />
          <FrontRail position={[0, 0, -100]} />
          <SideRail position={[-50, 1, 0]} />
          <SideRail position={[50, 1, 0]} />
          <FrontRail position={[0, 1, 100]} />
          <FlagWithPole position={[0, 0, -80]} />
          <Ball position={[0, 10, 0]} />
        </group>
      </Physics>
    </Canvas>
  );
};

export default GolfGround;
