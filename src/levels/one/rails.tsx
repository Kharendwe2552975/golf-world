//@ts-nocheck
import { useBox } from '@react-three/cannon';

export default function Rail({
  position,
  rotation = [0, 0, 0],
  size = [10, 5, 200],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
}) {
  const [ref] = useBox(() => ({ args: size, position: position, rotation: rotation }));

  return (
    <>
      <mesh ref={ref} position={position} rotation={rotation} receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={'#8B4513'} />
      </mesh>
    </>
  );
}
