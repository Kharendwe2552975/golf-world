import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, MathUtils } from 'three';

function GrassBlock({ position, color }: { position: [number, number, number]; color: string }) {
  const randomHeight = MathUtils.randFloat(0.2, 0.5);

  return (
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={[10, randomHeight, 10]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

/*function Flag({ position }: { position: [number, number, number] }) {
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
}*/

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
  return (
    <>
      <mesh position={position} rotation={rotation} receiveShadow>
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
  return (
    <>
      <mesh position={position} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 2, 110]} />
        <meshStandardMaterial color={'#8B4513'} />
      </mesh>
      <mesh position={[position[0], position[1] + 1, position[2]]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 0.1, 110]} />
        <meshStandardMaterial color={'#5C3A1D'} />
      </mesh>
    </>
  );
}

/*function FlagWithPole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Pole position={[0, 7.5, 0]} />
      <Flag position={[5.2, 40, 1]} />
      <Hole position={[0, 0, 0]} />
    </group>
  );
}*/

const GolfGround = () => {
  const groupRef = useRef<Group>(null);

  return (
    <Canvas
      camera={{ position: [0, 80, 150], fov: 60 }}
      shadows
      style={{ height: '100vh', width: '100vw' }}
    >
      <ambientLight intensity={0.4} />
      <spotLight position={[30, 60, 30]} angle={0.5} penumbra={0.5} intensity={1} castShadow />
      <pointLight position={[-20, 40, -20]} intensity={0.3} />

      <group ref={groupRef}>
        <group scale={[0.5, 1.5, 0.5]} position={[-20, 0, 50]}>
          <GrassGround />
          <SideRail position={[-50, 1, 0]} />
          <SideRail position={[50, 1, 0]} />
          <FrontRail position={[0, 1, 100]} />
        </group>

        <group scale={[0.5, 1.5, 0.5]} position={[5, 0, -27]} rotation={[0, Math.PI / 2, 0]}>
          <GrassGround />
          <SideRail position={[50, 1, 0]} />
          <FrontRail position={[0, 1, -100]} />
        </group>

        <group scale={[0.5, 1.5, 0.5]} position={[80, 0, -47]}>
          <GrassGround />
          <FrontRail position={[0, 1, -100]} />
          <SideRail position={[50, 1, 0]} />
          <FrontRail position={[0, 1, 100]} />
          <group position={[-100, 0, -0.2]}>
            <FrontRail position={[0, 1, 100]} />
          </group>
          <group rotation={[0, Math.PI / 2, 0]} position={[-150, 0, -60]}>
            <FrontRail position={[0, 1, 100]} />
          </group>
        </group>
      </group>
    </Canvas>
  );
};

export default GolfGround;
