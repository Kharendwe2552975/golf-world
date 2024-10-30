//@ts-nocheck
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Model({
  url,
  scale,
  position,
}: {
  url: string;
  scale: number;
  position: [number, number, number];
}) {
  const gltf = useLoader(GLTFLoader, url);
  console.log('Rendering tree at position:', position);

  return <primitive object={gltf.scene} scale={scale} position={position} />;
}
