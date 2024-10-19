import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

export const MouseCameraControls = ({
  isDragging,
  sceneRef,
}: {
  isDragging: boolean;
  sceneRef: React.MutableRefObject<THREE.Group>;
}) => {
  const { gl } = useThree(); // No need to reference the camera anymore
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  const minVerticalAngle = -Math.PI / 16; // Limit for looking down
  const maxVerticalAngle = Math.PI / 4; // Limit for looking up

  // Handle pointer lock and mouse movement
  useEffect(() => {
    const canvas = gl.domElement;

    const requestPointerLock = () => {
      if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isPointerLocked && !isDragging && sceneRef.current) {
        // Disable rotation if dragging
        const rotationSpeed = 0.002; // Adjust for faster/slower movement

        // Rotate the scene instead of the camera
        sceneRef.current.rotation.y -= event.movementX * rotationSpeed; // Horizontal rotation (yaw)

        // Vertical rotation (pitch) with limits
        const newRotationX = sceneRef.current.rotation.x - event.movementY * rotationSpeed;
        sceneRef.current.rotation.x = Math.max(
          minVerticalAngle,
          Math.min(maxVerticalAngle, newRotationX),
        );
      }
    };

    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === canvas);
    };

    // Listen for user click or keydown to activate pointer lock
    const handleUserInteraction = () => {
      requestPointerLock();
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousedown', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction); // Trigger pointer lock on keydown as a fallback

    return () => {
      // Cleanup event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousedown', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isPointerLocked, gl, isDragging, sceneRef]);

  return null;
};
