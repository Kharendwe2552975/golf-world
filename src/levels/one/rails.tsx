//@ts-nocheck
import { useBox } from '@react-three/cannon';

export function SideRail({
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

export function FrontRail({ position }: { position: [number, number, number] }) {
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
