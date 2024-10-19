import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils } from 'three';
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
      <cylinderGeometry args={[3.5, 1.5, 2, 32]} />
      <meshStandardMaterial color={'#FFFFFF'} />
    </mesh>
  );
}
export default function FlagWithPole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Pole position={[0, 7.5, 0]} />
      <Flag position={[5.2, 40, 1]} />
      <Hole position={[0, 0, 0]} />
    </group>
  );
}
