import React from 'react';
import ServerBall from './server-ball';
import { useSocket } from './socket-provider';

const MultiplayerBalls: React.FC = () => {
  const { players, currentPlayer } = useSocket();

  return (
    <>
      {Object.keys(players).map((playerId) =>
        playerId !== currentPlayer ? <ServerBall key={playerId} playerId={playerId} /> : null,
      )}
    </>
  );
};

export default MultiplayerBalls;
