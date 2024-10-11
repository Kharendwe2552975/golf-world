//@ts-nocheck
import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';

import skyScene from '../assets/sky.glb';

// 3D Model from: https://sketchfab.com/3d-models/phoenix-bird-844ba0cf144a413ea92c779f18912042
export default function Sky() {
  const sky = useGLTF(skyScene);
  const skyRef = useRef();

  return (
    <mesh ref={skyRef}>
      <primitive object={sky.scene} />
    </mesh>
  );
}
