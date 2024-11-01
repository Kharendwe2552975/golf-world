import GrassGround from '@/components/grass';
import Rail from '@/components/grass/rail';
import Plane from '../three/plane';

const LevelFourStartStage = ({ elevation = 60 }: { elevation?: number }) => {
  return (
    <>
      <GrassGround
        position={[-200, elevation, -35]}
        rails={[true, true, false, true]}
        numTilesX={10}
        numTilesZ={10}
      />
      {/* Custom Rail */}
      <Rail position={[-180, elevation, -50]} size={[70, 10, 25]} />
      {/* 
        START PLATFORM FOUNDATION 
          - Zero Origin
      */}
      <Plane
        size={[100, 100]}
        position={[-150, elevation - 55, 10]}
        rotation={[0, 0, 0]}
        thickness={100}
      />
    </>
  );
};

export default LevelFourStartStage;
