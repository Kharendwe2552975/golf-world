// Test.tsx
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Hill from './levels/three/hill';

export default function TestScene() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Hill />
      <OrbitControls />
    </Canvas>
  );
}
