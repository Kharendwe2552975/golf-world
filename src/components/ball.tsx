//@ts-nocheck
import { useSphere } from '@react-three/cannon';
import { useEffect } from 'react';

export default function Ball({ position }: { position: [number, number, number] }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    velocity: [0, 0, 500],
    args: [2],
    restitution: 0.8, // Higher values make the ball more bouncy
    onCollide: (e) => {
      console.log('Ball collided with:', e.body);
    },
  }));

  useEffect(() => {
    // Check the position of the ball periodically
    const unsubscribe = api.position.subscribe((p) => {
      // Detect if the ball has reached the edge of the hill
      if (p[0] < -50 || p[0] > 50 || p[2] < -50 || p[2] > 50) {
        // Reverse direction (apply bounce)
        api.velocity.set(-p[0] * 0.5, 10, -p[2] * 0.5); // Bounce back from the edge
      }
    });

    return () => unsubscribe();
  }, [api]);

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color={'#ff0000'} />
    </mesh>
  );
}
