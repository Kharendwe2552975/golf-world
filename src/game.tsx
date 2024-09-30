import { Physics, useBox, usePlane } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import RotatingBox from './rotating-box';

function Plane(props: any) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    // @ts-ignore
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
    </mesh>
  );
}

function Cube(props: any) {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], ...props }));
  return (
    // @ts-ignore
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color={'hotpink'} />
    </mesh>
  );
}

const Game = () => {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <RotatingBox position={[-1.2, 0, 0]} />
      <RotatingBox position={[1.2, 0, 0]} />

      <Physics>
        {/* <Debug color="black" scale={1.1}> */}
        <Plane />
        <Cube color="red" />
        {/* </Debug> */}
      </Physics>
    </Canvas>
  );
};

export default Game;
