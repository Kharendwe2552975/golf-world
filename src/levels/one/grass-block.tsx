//@ts-nocheck
import { useBox } from '@react-three/cannon';
import { MathUtils } from 'three';

export default function GrassBlock({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const randomHeight = MathUtils.randFloat(0.2, 0.5);
  const [ref] = useBox(() => ({ args: [10, randomHeight, 10], position, type: 'Static' }));

  return (
    <mesh ref={ref} position={position} receiveShadow castShadow>
      <boxGeometry args={[10, randomHeight, 10]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
