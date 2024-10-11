//@ts-nocheck
import { useSphere } from '@react-three/cannon';

export default function Ball({ position }: { position: [number, number, number] }) {
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
