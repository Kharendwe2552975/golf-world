import { useSphere } from '@react-three/cannon';
import React, { useEffect } from 'react';
import { useSocket } from './socket-provider';

interface ServerBallProps {
  playerId: string;
}

const ServerBall: React.FC<ServerBallProps> = ({ playerId }) => {
  const { players, currentPlayer } = useSocket();
  const playerData = players[playerId];

  // Sphere setup for server ball
  const [ref, api] = useSphere(() => ({
    mass: 0.045,
    args: [2],
    material: {
      friction: 0.1,
      restitution: 0.1,
      rollingFriction: 0.05,
    },
    linearDamping: 0.3,
    angularDamping: 0.4,
  }));
  // Position and apply force every time there's an update
  useEffect(() => {
    if (playerData && playerId !== currentPlayer) {
      // Set position based on playerData
      api.position.set(
        playerData.ball_position?.x || 0,
        playerData.ball_position?.y || 10,
        playerData.ball_position?.z || 80,
      );

      // Apply force if force data is present
      const force = playerData.force;
      const angle = playerData.aim_direction;

      if (force) {
        const forceX = Math.cos(-angle) * force * 4;
        const forceZ = Math.sin(-angle) * force * 4;
        api.applyForce([-forceX, 0, -forceZ], [0, 0, 0]);
      }
    }
  }, [playerData, playerId, currentPlayer, api]);

  return (
    //@ts-ignore
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default ServerBall;
