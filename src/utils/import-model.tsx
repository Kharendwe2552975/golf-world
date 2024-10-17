import { useGLTF } from '@react-three/drei';

export default function Model({
  url,
  scale,
  position,
}: {
  url: string;
  scale: number;
  position: [number, number, number];
}) {
  // Load the GLTF model
  const { scene } = useGLTF(url);

  return <primitive object={scene} scale={scale} position={position} />;
}
