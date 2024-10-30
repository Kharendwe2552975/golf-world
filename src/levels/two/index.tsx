//@ts-nocheck
import { Ocean } from '@/components/ocean';
import Rail from '@/components/rails';
import { usePlane } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { FrontSide, Group, Vector3 } from 'three';
import Ball from '../../components/ball/ball';
import FlagWithPole from '../../components/goal-point-flag';
import GrassGround from '../../components/grass';
import MiniCamera from '../../components/mini-camera';

const RotatingCylinder = ({
  position = [0, 5],
  speed = 0.1,
}: {
  position: [number, number, number];
  speed: number;
}) => {
  const verticalCylinderRef = useRef();
  const horizontalCylinderRef = useRef();
  // Rotate the horizontal cylinder around the vertical cylinder
  useFrame(() => {
    if (horizontalCylinderRef.current) {
      horizontalCylinderRef.current.rotation.y += speed; // Adjust rotation speed if needed
    }
  });

  return (
    <>
      {/* Vertical Cylinder */}
      <mesh ref={verticalCylinderRef} position={position} castShadow>
        <cylinderGeometry args={[10, 10, 10, 32]} /> {/* Small vertical cylinder */}
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Horizontal Cylinder (rotating around vertical cylinder) */}
      <mesh
        ref={horizontalCylinderRef}
        position={position}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[5, 5, 50, 32]} /> {/* Long thin horizontal cylinder */}
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
};

const StagePlatform = ({ position = [0, 0, 0] }: { position: [number, number, number] }) => {
  const groupRef = useRef<Group>(null);
  return (
    <group position={position} ref={groupRef}>
      <GrassGround />
      <Rail position={[0, 0, -100]} rotation={[0, Math.PI / 2, 0]} size={[5, 12, 110]} />{' '}
      {/* Increased height */}
      <Rail position={[-50, 1, 0]} />
      <Rail position={[50, 1, 0]} />
      <Rail position={[0, 0, 100]} rotation={[0, Math.PI / 2, 0]} size={[5, 12, 110]} />{' '}
      {/* Increased height */}
    </group>
  );
};

const Stage1 = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<Group>(null);
  return (
    <group position={position} ref={groupRef}>
      <StagePlatform />
      <RotatingCylinder speed={0.05} position={[0, 5, 40]} />
      <RotatingCylinder speed={0.1} position={[20, 5, -20]} />
      <RotatingCylinder speed={0.08} position={[-20, 5, -50]} />
    </group>
  );
};

const Stage2 = ({ position }: { position: [number, number, number] }) => {
  return (
    <>
      <StagePlatform position={position} />
      <FlagWithPole position={[position[0], position[1], position[2] - 85]} />{' '}
      {/* Adjusted position */}
    </>
  );
};

const InclinedPlane = ({ position = [0, 0, 0], angle = 0, size = [80, 80] }) => {
  // Create the plane and apply the rotation based on the angle
  const [ref] = usePlane(() => ({
    position,
    rotation: [-angle, 0, 0], // Rotate around the x-axis to incline the plane
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
};

const Level2 = ({ increaseScore }: { increaseScore: () => void }) => {
  const groupRef = useRef<Group>(null);
  const holePosition = [0, 0, -100]; // Adjusted hole position
  const { camera } = useThree();
  const ocean = useRef();
  camera.position.set(0, 0, 500);
  return (
    <group>
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
      <Stage1 position={[0, 5, 100]} />
      <Stage2 position={[0, 25, -150]} />
      <group rotation={[0, 0, 0]}>
        <InclinedPlane position={[0, 20, 0]} angle={Math.PI / 3} />
      </group>
      <Ball position={[0, 20, 300]} /> {/* Added Ball component */}
      <MiniCamera position={[0, 10, 0]} />
    </group>
  );
};

export default Level2;
