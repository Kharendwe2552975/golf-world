import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { PerspectiveCamera, WebGLRenderer } from 'three';

interface MiniCameraProps {
  position: [number, number, number];
}

const MiniCamera = ({ position }: MiniCameraProps) => {
  const { scene, size } = useThree();
  const miniCameraRef = useRef<PerspectiveCamera>(null);
  const miniRendererRef = useRef<WebGLRenderer>(new WebGLRenderer({ antialias: true }));

  useEffect(() => {
    miniRendererRef.current.setSize(200, 200);
    miniRendererRef.current.domElement.style.position = 'absolute';
    miniRendererRef.current.domElement.style.top = '65px';
    miniRendererRef.current.domElement.style.right = '1145px';
    document.body.appendChild(miniRendererRef.current.domElement);

    // Cleanup function to remove mini renderer on unmount
    return () => {
      if (miniRendererRef.current) {
        document.body.removeChild(miniRendererRef.current.domElement);
        miniRendererRef.current.dispose();
        (miniRendererRef.current as any) = null;
      }
    };
  }, []);

  useFrame(() => {
    if (miniCameraRef.current && miniRendererRef.current) {
      miniCameraRef.current.position.set(...position);
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
