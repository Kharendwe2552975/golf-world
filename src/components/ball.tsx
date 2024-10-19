//@ts-nocheck
import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

export default function Ball({
  position,
  holePosition,
}: {
  position: [number, number, number];
  holePosition: [number, number, number];
}) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [2], // radius of the ball
    restitution: 1, // for bouncing off the walls
    velocity: [0, 0, 0], // initial velocity
    linearDamping: 0.5, // to reduce sliding over time
    angularDamping: 0.5,
  }));

  const { gl, scene, camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [canDrag, setCanDrag] = useState(true);
  const [startMousePos, setStartMousePos] = useState<THREE.Vector2 | null>(null);
  const [endMousePos, setEndMousePos] = useState<THREE.Vector2 | null>(null);
  const [ballPosition, setBallPosition] = useState<[number, number, number]>(position);
  const [ballVelocity, setBallVelocity] = useState<[number, number, number]>([0, 0, 0]);

  const arrowRef = useState(() => new THREE.Mesh())[0];

  useEffect(() => {
    // Create the larger triangle geometry for the arrow
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0,
      1,
      20, // Arrow tip
      -1,
      -1,
      0, // Bottom left
      1,
      -1,
      0, // Bottom right
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    arrowRef.geometry = geometry;
    arrowRef.material = material;
    arrowRef.visible = false; // Initially hidden
    scene.add(arrowRef);

    return () => {
      scene.remove(arrowRef);
    };
  }, [arrowRef, scene]);

  useEffect(() => {
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('mouseup', handleMouseUp);

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startMousePos, endMousePos, canDrag]);

  useEffect(() => {
    // Subscribe to ball position updates
    const unsubscribePosition = api.position.subscribe((p) => {
      setBallPosition([p[0], p[1], p[2]]);
    });

    // Subscribe to ball velocity updates
    const unsubscribeVelocity = api.velocity.subscribe((v) => {
      setBallVelocity([v[0], v[1], v[2]]);

      const speed = Math.sqrt(v[0] ** 2 + v[2] ** 2);
      if (speed < 0.1) {
        setCanDrag(true);
        arrowPosition();
        arrowRef.visible = true;
      } else {
        setCanDrag(false);
        arrowRef.visible = false;
      }
    });

    return () => {
      unsubscribePosition();
      unsubscribeVelocity();
    };
  }, [api.position, api.velocity]);

  const handleMouseUp = () => {
    if (isDragging && startMousePos && endMousePos && canDrag) {
      const dragVector = new THREE.Vector2(
        endMousePos.x - startMousePos.x,
        endMousePos.y - startMousePos.y,
      );

      const dragLength = dragVector.length();
      const impulseDirection = dragVector.normalize().multiplyScalar(-dragLength * 5);

      // Apply impulse in the direction relative to the scene's rotation
      const sceneRotationY = scene.rotation.y; // Get the scene's Y-axis rotation
      const rotatedImpulse = rotateVector2(impulseDirection, -sceneRotationY); // Rotate the direction by the scene's rotation

      api.applyImpulse([rotatedImpulse.x, 0, rotatedImpulse.y], [0, 0, 0]);

      arrowRef.visible = false;
    }

    setIsDragging(false);
    setStartMousePos(null);
    setEndMousePos(null);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const { clientX, clientY } = event;
      setEndMousePos(new THREE.Vector2(clientX, clientY));

      if (startMousePos) {
        const dragVector = new THREE.Vector2(clientX - startMousePos.x, clientY - startMousePos.y);
        const direction = dragVector.normalize().multiplyScalar(-1); // Reverse direction for arrow

        // Show the arrow during dragging
        arrowRef.visible = true;
        arrowRef.rotation.set(0, Math.atan2(direction.x, direction.y), 0);

        // Adjust arrow rotation based on scene's Y rotation
        const sceneRotationY = scene.rotation.y;
        arrowRef.rotation.y += sceneRotationY;
      }
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (canDrag) {
      const { clientX, clientY } = event;
      setStartMousePos(new THREE.Vector2(clientX, clientY));
      setIsDragging(true);
    }
  };

  const arrowPosition = () => {
    arrowRef.position.set(
      ballPosition[0],
      ballPosition[1] + 5, // Slightly above the ball
      ballPosition[2],
    );
  };

  // Sync the arrow position with the ball in real time
  useFrame(() => {
    if (isDragging) {
      arrowPosition();
    }
  });

  // Helper function to rotate a 2D vector (for applying scene rotation)
  const rotateVector2 = (vector: THREE.Vector2, angle: number) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new THREE.Vector2(vector.x * cos - vector.y * sin, vector.x * sin + vector.y * cos);
  };

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color={'#ff0000'} />
    </mesh>
  );
}
