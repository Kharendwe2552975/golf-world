import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { useBall } from './ball-provider';

// Custom component to handle camera position and movement
const CameraController = () => {
  const { position: ballPosition } = useBall(); // Get the ball position from context
  const { camera } = useThree(); // Access the camera
  const cameraOffset = useRef<[number, number, number]>([0, 80, 80]); // Offset for the camera

  useFrame(() => {
    if (ballPosition) {
      const [ballX, ballY, ballZ] = ballPosition;
      const [offsetX, offsetY, offsetZ] = cameraOffset.current;

      // Update the camera position based on the ball position and offset
      camera.position.set(ballX + offsetX, ballY + offsetY, ballZ + offsetZ);
      camera.lookAt(ballX, ballY, ballZ); // Make the camera look at the ball
    }
  });

  return null;
};

export default CameraController;