import React from 'react';
import GrassBlock from './grass-block';
import HoleBlock from './hole-block';
import Rail from './rail';

interface GrassGroundProps {
  holeCoords?: { x: number; z: number };
  position?: [number, number, number];
  numTilesX?: number;
  numTilesZ?: number;
  rails?: [boolean, boolean, boolean, boolean]; // [top, right, bottom, left]
  extendRailNum?: number;
}

// Main ground layout
const GrassGround: React.FC<GrassGroundProps> = ({
  holeCoords,
  position = [-50, 0, -100],
  numTilesX = 10,
  numTilesZ = 20,
  rails = [false, false, false, false],
  extendRailNum = 2,
}) => {
  const tiles = [];

  for (let x = 0; x < numTilesX; x++) {
    for (let z = 0; z < numTilesZ; z++) {
      const worldX = position[0] + x * 10;
      const worldY = position[1];
      const worldZ = position[2] + z * 10;

      // Check if this tile should have the hole
      const hasHole = x === holeCoords?.x && z === holeCoords?.z;

      tiles.push(
        hasHole ? (
          <HoleBlock key={`hole-${x}-${worldY}-${z}`} position={[worldX, worldY, worldZ]} />
        ) : (
          <GrassBlock key={`grass-${x}-${worldY}-${z}`} position={[worldX, worldY, worldZ]} />
        ),
      );
    }
  }

  return (
    <group>
      {tiles}
      {/* Rails around the GrassGround if specified */}
      {rails[0] && (
        <Rail
          position={[
            position[0] + (numTilesX * 10) / 2 - 5,
            position[1],
            position[2] + numTilesZ * 10,
          ]}
          rotation={[0, Math.PI / 2, 0]}
          size={[10, 10, numTilesX * (10 + extendRailNum)]}
        />
      )}
      {rails[1] && (
        <Rail
          position={[
            position[0] + numTilesX * 10,
            position[1],
            position[2] + (numTilesZ * 10) / 2 - 5,
          ]}
          rotation={[0, 0, 0]}
          size={[10, 10, numTilesZ * 10]}
        />
      )}
      {rails[2] && (
        <Rail
          position={[position[0] + (numTilesX * 10) / 2 - 5, position[1], position[2] - 10]}
          rotation={[0, Math.PI / 2, 0]}
          size={[10, 10, numTilesX * (10 + extendRailNum)]}
        />
      )}
      {rails[3] && (
        <Rail
          position={[position[0] - 10, position[1], position[2] + (numTilesZ * 10) / 2 - 5]}
          rotation={[0, 0, 0]}
          size={[10, 10, numTilesZ * 10]}
        />
      )}
    </group>
  );
};

export default GrassGround;
