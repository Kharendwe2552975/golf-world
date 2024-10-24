import { Box, Typography } from '@mui/material'; // Import MUI components
import { useSphere } from '@react-three/cannon';
import { Html, shaderMaterial } from '@react-three/drei'; // Import Html from drei
import { extend } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { fragmentShader } from '../components/shaders/fragmentShader';
import { vertexShader } from '../components/shaders/vertexShader';
import { ballTexture } from '../components/textures/ballTexture';

// Import audio files
import hitSound from '../assets/hit.mp3';
import winSound from '../assets/win.mp3';

// Define the custom shader material
const CustomMaterial = shaderMaterial(
  {
    uTexture: ballTexture,
    uLightPosition: new THREE.Vector3(30, 50, 30),
    uLightColor: new THREE.Color(1, 1, 1),
    uAmbientLight: new THREE.Color(0.2, 0.2, 0.2),
  },
  vertexShader,
  fragmentShader,
);

extend({ CustomMaterial });

export default function Ball({ position }: { position: [number, number, number] }) {
  const [ballPosition, setBallPosition] = useState<[number, number, number]>(position);
  const [showWinPopup, setShowWinPopup] = useState(false); // State to control popup visibility

  const holePosition = { x: 5 * 10 - 50, z: 2 * 10 - 100 }; // Calculate the hole's world position
  const holeRadius = 3; // Same as in your tile with hole

  const hitAudio = new Audio(hitSound);
  const winAudio = new Audio(winSound);

  // Preload audio files
  useEffect(() => {
    hitAudio.load();
    winAudio.load();
  }, [hitAudio, winAudio]);

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    velocity: [0, 0, -90], // Initial velocity
    args: [2], // radius of the ball
    onCollide: (e) => {
      console.log('Ball collided with:', e.body);
      hitAudio.play().catch((error) => {
        console.error('Failed to play hit sound:', error);
      });
    },
  }));

  useEffect(() => {
    // Subscribe to ball position updates
    api.position.subscribe((p) => {
      setBallPosition([p[0], p[1], p[2]]);

      // Check if the ball is falling (y position is negative)
      if (p[1] < 0 && !showWinPopup) {
        // Ensure popup shows only once
        const distanceToHole = Math.sqrt(
          (p[0] - holePosition.x) ** 2 + (p[2] - holePosition.z) ** 2,
        );

        // Check if the ball is within the hole's radius
        if (distanceToHole < holeRadius) {
          setShowWinPopup(true); // Trigger popup
          winAudio.play().catch((error) => {
            console.error('Failed to play win sound:', error);
          });
        }
      }
    });
  }, [api.position, holePosition, showWinPopup, winAudio]);

  return (
    <>
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[2, 32, 32]} />
        <customMaterial attach="material" uTexture={ballTexture} />
      </mesh>
      {showWinPopup && (
        <Html position={[0, 10, 0]} zIndexRange={[100, 0]}>
          <Box
            sx={{
              padding: '20px',
              backgroundColor: 'rgba(0, 255, 0, 0.8)',
              color: 'white',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              width: '200px', // Set width for a rectangular shape
            }}
          >
            <Typography variant="h5">You Won!</Typography>
          </Box>
        </Html>
      )}
    </>
  );
}
