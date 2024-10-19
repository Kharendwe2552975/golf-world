//@ts-nocheck
import { Physics } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { FrontSide, Vector3 } from 'three';
import LevelCompletePopup from './components/info-level-complete';
import { Ocean } from './components/ocean';
import LevelOne from './levels/one';
import Level3 from './levels/three';
import Sky from './models/sky';

const GetLevel = ({ level }: { level: number }) => {
  return level == 1 ? <LevelOne /> : <Level3 />;
};

const GameStage = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  // Simulate level completion (replace with actual game logic)
  const completeLevel = () => {
    setIsLevelComplete(true);
    setScore(0);
    setLevel(2);
  };

  // Function to hide the popup and move to the next level (or reset)
  const nextLevel = () => {
    setIsLevelComplete(false);

    // Logic for starting the next level goes here
  };
  // Function to update score (this would be based on your game logic)
  const increaseScore = () => {
    setScore(score + 1);
    if (score == 10) {
      completeLevel();
    }
  };
  const ocean = useRef();

  return (
    <>
      <Canvas
        camera={{ position: [0, 80, 150], fov: 60 }}
        shadows
        style={{ height: '100vh', width: '100vw' }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={300}
          minPolarAngle={0} // Prevent the camera from rotating below the horizon
          maxPolarAngle={(Math.PI - 0.2) / 2}
        />
        <Sky />
        <ambientLight intensity={0.4} />
        <spotLight position={[30, 60, 30]} angle={0.5} penumbra={0.5} intensity={1} castShadow />
        <pointLight position={[-20, 40, -20]} intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Physics gravity={[0, -9.81, 0]}>
          <Ocean
            ref={ocean}
            dimensions={[800, 800]}
            normals="./Normals/waternormals.jpg"
            distortionScale={20}
            size={10}
            options={{
              // defaults
              clipBias: 0,
              alpha: 0.8,
              waterNormals: null, // automatically set to provided texture from "normals" prop
              sunDirection: new Vector3(0.70707, 0.70707, 0),
              sunColor: 0xffffff,
              waterColor: 0x001e0f,
              eye: new Vector3(0, 0, 0),
              distortionScale: 3.7, // automatically set from "distortionScale" prop
              side: FrontSide,
              fog: true,
            }}
          />
          <GetLevel level={level} />
        </Physics>
      </Canvas>
      <div
        style={{
          fontFamily: 'Roboto, sans-serif',
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
        }}
      >
        <h1>Score: {score}</h1>
      </div>

      {/* Simulate score update */}
      <button
        onClick={increaseScore}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          padding: '10px 20px',
          fontSize: '16px',
        }}
      >
        Increase Score
      </button>
      <LevelCompletePopup isVisible={isLevelComplete} onClose={nextLevel} />
    </>
  );
};

export default GameStage;
