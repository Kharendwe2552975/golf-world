//@ts-nocheck
import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

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

  const { gl, scene } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [canDrag, setCanDrag] = useState(true);
  const [startMousePos, setStartMousePos] = useState<THREE.Vector2 | null>(null);
  const [endMousePos, setEndMousePos] = useState<THREE.Vector2 | null>(null);

  const arrowRef = useState(() => new THREE.Mesh())[0];
  useEffect(() => {
    // Create the larger triangle geometry for the arrow
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0,
      1,
      20,
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
  // Check if ball is close enough to the hole
  useFrame(() => {
    const ballPosition = ref.current?.position;
    const holeVector = new THREE.Vector3(...holePosition);

    if (ballPosition) {
      const distanceToHole = ballPosition.distanceTo(holeVector);

      // If the ball is close enough to the hole, stop it and "enter" the hole
      if (distanceToHole < 3) {
        api.velocity.set(0, 0, 0); // Stop the ball
        api.position.set(holePosition[0], holePosition[1], holePosition[2]); // Position ball in the hole
      }
    }
  });

  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((velocity) => {
      const speed = Math.sqrt(velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2);
      if (speed < 0.1) {
        setCanDrag(true);
      } else {
        setCanDrag(false);
      }
    });

    return () => unsubscribe();
  }, [api.velocity]);

  const handleMouseUp = () => {
    if (isDragging && startMousePos && endMousePos && canDrag) {
      const dragVector = new THREE.Vector2(
        endMousePos.x - startMousePos.x,
        endMousePos.y - startMousePos.y,
      );

      const dragLength = dragVector.length();
      const impulseDirection = dragVector.normalize().multiplyScalar(-dragLength * 10);

      api.applyImpulse([impulseDirection.x, 0, impulseDirection.y], [0, 0, 0]);

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

        // Position and rotate the arrow based on the reversed drag direction
        arrowRef.visible = true;
        arrowRef.position.set(
          ref.current.position.x,
          ref.current.position.y + 3,
          ref.current.position.z,
        );
        arrowRef.rotation.set(0, Math.atan2(direction.x, direction.y), 0);
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

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color={'#ff0000'} />
    </mesh>
  );
}
