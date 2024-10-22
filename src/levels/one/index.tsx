//@ts-nocheck
import Ball from '@/components/ball/ball';
import Rail from '@/components/rails';
import { useRef } from 'react';
import { Group } from 'three';
import GrassGround from '../../components/grass';

const LevelOne = ({ increaseScore }: { increaseScore: () => void }) => {
  const groupRef = useRef<Group>(null);
  const holePosition = [0, 0, -80];
  const ocean = useRef();
  return (
    <group ref={groupRef}>
      {/* <Ocean
        ref={ocean}
        dimensions={[400, 400]}
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
      /> */}
      <GrassGround />
      <Rail position={[0, 0, -100]} rotation={[0, Math.PI / 2, 0]} size={[10, 5, 110]} />
      <Rail position={[-50, 1, 0]} />
      <Rail position={[50, 1, 0]} />
      <Rail position={[0, 1, 100]} rotation={[0, Math.PI / 2, 0]} size={[10, 5, 110]} />
      <Ball increaseScore={increaseScore} />
    </group>
  );
};

export default LevelOne;
