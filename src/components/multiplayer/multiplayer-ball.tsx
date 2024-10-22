import ServerBall from './server-ball';
import useMultiplayerGameState from './use-multiplayer-state';

const MultiplayerBalls = () => {
  const { players, ballPositions, playerName } = useMultiplayerGameState();

  return (
    <>
      {players.map((player, index) => {
        if (player === playerName) return null;
        return <ServerBall key={index} position={ballPositions[player]} />;
      })}
    </>
  );
};

export default MultiplayerBalls;
