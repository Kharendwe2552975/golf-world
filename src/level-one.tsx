//@ts-nocheck
import { Physics, useBox, useSphere } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { ArrowHelper, Group, MathUtils, Vector3 } from 'three';
import Sky from './models/sky';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function GrassBlock({ position, color }: { position: [number, number, number]; color: string }) {
  const randomHeight = MathUtils.randFloat(0.2, 0.5);
  const [ref] = useBox(() => ({ args: [10, randomHeight, 10], position, type: 'Static' }));

  return (
    <mesh ref={ref} position={position} receiveShadow castShadow>
      <boxGeometry args={[10, randomHeight, 10]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Flag({ position }: { position: [number, number, number] }) {
  const flagRef = useRef(null);

  useFrame(({ clock }) => {
    if (flagRef.current) {
      const elapsed = clock.getElapsedTime();
      (flagRef.current as any).rotation.z = MathUtils.degToRad(Math.sin(elapsed) * 5);
    }
  });

  return (
    <mesh ref={flagRef} position={position}>
      <planeGeometry args={[12, 7]} />
      <meshStandardMaterial color={'#ff1a1a'} side={2} />
    </mesh>
  );
}

function Pole({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} receiveShadow>
      <cylinderGeometry args={[0.5, 0.5, 72, 32]} />
      <meshStandardMaterial color={'#ffffff'} />
    </mesh>
  );
}

function Hole({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} receiveShadow>
      <cylinderGeometry args={[1.5, 1.5, 1, 32]} />
      <meshStandardMaterial color={'#000000'} />
    </mesh>
  );
}

function GrassGround() {
  const tiles = [];
  const numTilesX = 10;
  const numTilesZ = 20;

  for (let x = 0; x < numTilesX; x++) {
    for (let z = 0; z < numTilesZ; z++) {
      const color = (x + z) % 2 === 0 ? '#39d353' : '#28a745';
      tiles.push(
        <GrassBlock key={`${x}-${z}`} position={[-50 + x * 10, 0, -100 + z * 10]} color={color} />,
      );
    }
  }

  return <group>{tiles}</group>;
}

function SideRail({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const [ref] = useBox(() => ({ args: [10, 2, 200], position, rotation, type: 'Static' }));

  return (
    <>
      <mesh ref={ref} position={position} rotation={rotation} receiveShadow>
        <boxGeometry args={[10, 2, 200]} />
        <meshStandardMaterial color={'#8B4513'} />
      </mesh>
      <mesh position={[position[0], position[1] + 1, position[2]]}>
        <boxGeometry args={[10, 0.1, 200]} />
        <meshStandardMaterial color={'#5C3A1D'} />
      </mesh>
    </>
  );
}

function FrontRail({ position }: { position: [number, number, number] }) {
  const [ref] = useBox(() => ({
    args: [10, 20, 110],
    position,
    rotation: [0, Math.PI / 2, 0],
    type: 'Static',
  }));

  return (
    <>
      <mesh ref={ref} position={position} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 20, 110]} />
        <meshStandardMaterial color={'#8B4513'} />
      </mesh>
      <mesh position={[position[0], position[1] + 1, position[2]]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 20, 110]} />
        <meshStandardMaterial color={'#5C3A1D'} />
      </mesh>
    </>
  );
}

function FlagWithPole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Pole position={[0, 7.5, 0]} />
      <Flag position={[5.2, 40, 1]} />
      <Hole position={[0, 0, 0]} />
    </group>
  );
}

function Ball({
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

  const { gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [canDrag, setCanDrag] = useState(true);
  const [startMousePos, setStartMousePos] = useState<THREE.Vector2 | null>(null);
  const [endMousePos, setEndMousePos] = useState<THREE.Vector2 | null>(null);

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
    }

    setIsDragging(false);
    setStartMousePos(null);
    setEndMousePos(null);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const { clientX, clientY } = event;
      setEndMousePos(new THREE.Vector2(clientX, clientY));
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

const GolfGround = () => {
  const groupRef = useRef<Group>(null);
  const holePosition = [0, 0, -80]; // Same as the hole's position

  return (
    <Canvas
      camera={{ position: [0, 80, 150], fov: 60 }}
      shadows
      style={{ height: '100vh', width: '100vw' }}
    >
      <ambientLight intensity={0.4} />
      <spotLight position={[30, 60, 30]} angle={0.5} penumbra={0.5} intensity={1} castShadow />
      <pointLight position={[-20, 40, -20]} intensity={0.3} />

      <Physics gravity={[0, -9.81, 0]}>
        <group ref={groupRef}>
          <GrassGround />
          <FrontRail position={[0, 0, -100]} />
          <SideRail position={[-50, 1, 0]} />
          <SideRail position={[50, 1, 0]} />
          <FrontRail position={[0, 1, 100]} />
          <FlagWithPole position={holePosition} />
          <Ball position={[0, 10, 0]} holePosition={holePosition} />
        </group>
      </Physics>
    </Canvas>
  );
};

export default GolfGround;
