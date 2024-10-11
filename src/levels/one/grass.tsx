//@ts-nocheck
import { useBox } from '@react-three/cannon';
import { MathUtils } from 'three';

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

export default function GrassGround() {
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
