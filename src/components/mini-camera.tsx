import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { PerspectiveCamera, WebGLRenderer } from 'three';

const MiniCamera = () => {
  const { scene, gl, size } = useThree();
  const miniCameraRef = useRef<PerspectiveCamera>(null);
  const miniRendererRef = useRef<WebGLRenderer>(null);

  useEffect(() => {
    if (!miniRendererRef.current) {
      miniRendererRef.current = new WebGLRenderer({ antialias: true });
      miniRendererRef.current.setSize(200, 200);
      miniRendererRef.current.domElement.style.position = 'absolute';
      miniRendererRef.current.domElement.style.top = '10px';
      miniRendererRef.current.domElement.style.right = '10px';
      document.body.appendChild(miniRendererRef.current.domElement);
    }
  }, []);

  useFrame(() => {
    if (miniCameraRef.current && miniRendererRef.current) {
      miniCameraRef.current.position.set(0, 600, 20);
      miniCameraRef.current.lookAt(scene.position);
      miniRendererRef.current.render(scene, miniCameraRef.current);
    }
  });

  return (
    <perspectiveCamera
      ref={miniCameraRef}
      fov={75}
      aspect={size.width / size.height}
      near={0.1}
      far={1000}
    />
  );
};

export default MiniCamera;
