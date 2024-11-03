//@ts-nocheck
import { useGLTF } from '@react-three/drei';

import clifSkyScene from '@/assets/sky/clif-sky.glb';
import cloudySkyScene from '@/assets/sky/cloudy-sky.glb';
import neonLightSkyScene from '@/assets/sky/neon-lights.glb';
import spaceSky from '@/assets/sky/space-sky.glb';
import { useGame } from '@/game-context';

// 3D Model from: https://sketchfab.com/3d-models/phoenix-bird-844ba0cf144a413ea92c779f18912042
export default function Sky() {
  const { currentLevel } = useGame();
  let skyScene = cloudySkyScene;
  switch (currentLevel) {
    case 1:
      skyScene = cloudySkyScene;
      break;
    case 2:
      skyScene = neonLightSkyScene;
      break;
    case 3:
      skyScene = spaceSky;
      break;
    case 4:
      skyScene = clifSkyScene;
      break;
  }

  const sky = useGLTF(skyScene);

  return (
    <mesh>
      <primitive object={sky.scene} />
    </mesh>
  );
}
