//@ts-nocheck
import { Physics } from '@react-three/cannon';
import { Canvas, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import LevelOne from './levels/one';
import Sky from './models/sky';
import { MouseCameraControls } from './MouseCameraControls';

const GetLevel = () => {
  return <LevelOne />;
};

const GameStage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const sceneRef = useRef<THREE.Group>(null); // Reference to the scene group

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <Canvas
      camera={{ position: [0, 80, 150], fov: 60 }}
      shadows
      style={{ height: '100vh', width: '100vw', cursor: 'none' }} // Hide cursor
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Custom mouse controls */}
      <MouseCameraControls isDragging={isDragging} sceneRef={sceneRef} />

      <ambientLight intensity={0.4} />
      <spotLight position={[30, 60, 30]} angle={0.5} penumbra={0.5} intensity={1} castShadow />
      <pointLight position={[-20, 40, -20]} intensity={0.3} />

      <group ref={sceneRef}>
        {/* The scene contents are now inside this group */}
        <Sky />
        <Physics gravity={[0, -9.81, 0]}>
          <GetLevel />
        </Physics>
      </group>
    </Canvas>
  );
};

export default GameStage;
