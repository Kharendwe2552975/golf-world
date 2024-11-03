import Rail from '@/components/grass/rail';
import Plane from '../three/plane';

const LevelFourIncline = () => {
  return (
    <>
      <Plane
        size={[200, 20]}
        position={[-70, -10, -50]}
        rotation={[0, 0, -Math.PI / 9]}
        thickness={100}
      />
      {/* INCLINE PLANE RAIL */}
      <Rail position={[-165, 30, -50]} size={[100, 10, 25]} rotation={[0, 0, (3 * Math.PI) / 9]} />
    </>
  );
};

export default LevelFourIncline;
