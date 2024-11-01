import GrassGround from '@/components/grass';
import Rail from '@/components/grass/rail';
import Plane from '../three/plane';
import Surface from './surface';

// CONTAINS:
//    Grass Ground object with custom rails
//    Heightmap surface object with rails
//    Box underneath acting as foundation

const LevelFourRockyStage = () => {
  return (
    <>
      <GrassGround
        position={[-20, 20, -80]}
        rails={[false, true, true, false]}
        numTilesX={11}
        numTilesZ={10}
      />
      {/* GRASS GROUND CUSTOM RAIL */}
      <Rail position={[-30, 20, -75]} size={[10, 20, 30]} rotation={[0, 0, 0]} />
      {/* STAGE 2 FOUNDATION */}
      <Plane size={[105, 95]} position={[30, 7, -40]} rotation={[0, 0, 0]} thickness={20} />

      {/* ROCKY SURFACE */}
      <Surface position={[-35, 1, 200]} />
      {/* SOUTH MOST RAIL */}
      <Rail position={[20, 10, 200]} size={[110, 40, 10]} rotation={[0, 0, 0]} />
      {/* WEST MOST RAIL */}
      <Rail position={[-30, 10, 80]} size={[10, 40, 240]} rotation={[0, 0, 0]} />
      {/* EAST MOST RAIL */}
      <Rail position={[90, 10, 50]} size={[10, 40, 80]} rotation={[0, 0, 0]} />
    </>
  );
};

export default LevelFourRockyStage;
