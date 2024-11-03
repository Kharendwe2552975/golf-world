import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { golfFabricMaterial } from './textures/flag';

function Flag({ position }: { position: [number, number, number] }) {
  const flagRef = useRef(null);

  useFrame(({ clock }) => {
    if (flagRef.current) {
      const elapsed = clock.getElapsedTime();
      (flagRef.current as any).geometry.attributes.position.needsUpdate = true;
      const positions = (flagRef.current as any).geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = Math.sin(elapsed + positions[i] * 0.1) * 0.5;
      }
    }
  });

  const vertices = new Float32BufferAttribute([0, 0, 0, 12, 0, 0, 0, 7, 0], 3);

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', vertices);

  return (
    <mesh ref={flagRef} position={position}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={golfFabricMaterial} attach="material" />
    </mesh>
  );
}

function Pole({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} receiveShadow>
      <cylinderGeometry args={[0.5, 0.5, 45, 32]} />
      <meshStandardMaterial color={'#ffffff'} />
    </mesh>
  );
}

export default function FlagWithPole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Pole position={[0, 22, -3.5]} />
      <Flag position={[0, 38, -3.5]} />
    </group>
  );
}
